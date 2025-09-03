import { Level } from 'level'
import { ICompany } from './models/Company.js'
import { IPosition, Position } from './models/Position.js'

export interface MigrationResult {
    success: boolean
    message: string
    details?: any
}

export class DataMigration {
    /**
     * Validates if a company object has the correct structure
     */
    static validateCompanyStructure(company: any): boolean {
        if (!company || typeof company !== 'object') return false
        
        // Check required fields
        if (!company.company || typeof company.company !== 'string') return false
        if (!Array.isArray(company.positions)) return false
        
        // Check positions structure
        for (const position of company.positions) {
            if (!this.validatePositionStructure(position)) return false
        }
        
        return true
    }
    
    /**
     * Validates if a position object has the correct structure
     */
    static validatePositionStructure(position: any): boolean {
        if (!position || typeof position !== 'object') return false
        
        const requiredFields = ['company', 'name', 'url', 'status', 'tier', 'createdDate', 'lastUpdated']
        
        for (const field of requiredFields) {
            if (!(field in position)) return false
        }
        
        // Validate status values
        const validStatuses = ['active', 'filled', 'rejected', 'accepted']
        if (!validStatuses.includes(position.status)) return false
        
        // Validate tier values
        const validTiers = ['S', 'A', 'B']
        if (!validTiers.includes(position.tier)) return false
        
        return true
    }
    
    /**
     * Converts _id fields to id fields
     */
    static convertUnderscoreIds(obj: any): any {
        if (!obj || typeof obj !== 'object') return obj
        
        const converted = { ...obj }
        
        if ('_id' in converted) {
            converted.id = converted._id
            delete converted._id
        }
        
        // Handle nested objects (like positions)
        if (converted.positions && Array.isArray(converted.positions)) {
            converted.positions = converted.positions.map((pos: any) => this.convertUnderscoreIds(pos))
        }
        
        return converted
    }
    
    /**
     * Restructures data to use proper class instances
     */
    static restructureCompany(companyData: any): ICompany {
        const cleanData = this.convertUnderscoreIds(companyData)
        
        const positions = cleanData.positions.map((pos: any) => new Position(
            pos.company,
            pos.name,
            pos.url,
            pos.status,
            pos.tier,
            pos.createdDate,
            pos.lastUpdated,
            pos.id || undefined
        ))
        
        return {
            id: cleanData.id,
            company: cleanData.company,
            positions: positions,
            AddPosition: function(position: IPosition) {
                this.positions.push(position)
            }
        }
    }
    
    /**
     * Performs a complete data audit
     */
    static async auditDatabase(db: Level<string, ICompany>): Promise<{
        totalCompanies: number
        validCompanies: number
        invalidCompanies: number
        totalPositions: number
        issues: string[]
    }> {
        const result = {
            totalCompanies: 0,
            validCompanies: 0,
            invalidCompanies: 0,
            totalPositions: 0,
            issues: [] as string[]
        }
        
        try {
            for await (const [key, value] of db.iterator()) {
                result.totalCompanies++
                
                if (this.validateCompanyStructure(value)) {
                    result.validCompanies++
                    result.totalPositions += value.positions.length
                } else {
                    result.invalidCompanies++
                    result.issues.push(`Company "${key}" has invalid structure`)
                }
                
                // Check for specific issues
                if (this.hasUnderscoreId(value)) {
                    result.issues.push(`Company "${key}" has _id fields`)
                }
                
                if (value.positions && value.positions.length > 0) {
                    for (const pos of value.positions) {
                        if (this.hasUnderscoreId(pos)) {
                            result.issues.push(`Position "${pos.name}" in company "${key}" has _id field`)
                        }
                    }
                }
            }
        } catch (error) {
            result.issues.push(`Database read error: ${error}`)
        }
        
        return result
    }
    
    private static hasUnderscoreId(obj: any): boolean {
        return obj && typeof obj === 'object' && '_id' in obj
    }
}
