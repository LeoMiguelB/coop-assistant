import React, { useEffect } from 'react'
import {ICompany} from '../models/Company.js'
import {IPosition} from '../models/Position.js'
import {Box, Text} from 'ink'

export interface JobsViewProps {
    positions: AsyncIterable<ICompany>
}

export const JobsView: React.FC<JobsViewProps> = (props: JobsViewProps) => {
    const {positions} = props

    const [companies, setCompanies] = React.useState<ICompany[]>([])

    useEffect(() => {
        let cancelled = false;
        // call asynchronously and update state as we go
        // this helps to not load everything early one, and only till now
        (async () => {
            for await (const company of positions) {
                if (cancelled) break

                setCompanies(prev => [...prev, company])
            }
        })()
        return () => {
            cancelled = true
        }
    }, [positions])

    return (
        <Box flexDirection='column'>
            {companies.map((company) => (
                <Box
                    key={company.id}
                    flexDirection='column'
                    borderStyle='round'
                    borderColor='cyan'
                    paddingX={1}
                    marginBottom={1}
                >
                    <Text color='cyan' bold>
                        Company:{' '}
                        <Text color='white' bold>
                            {company.company}
                        </Text>
                    </Text>
                    <Box flexDirection='column' marginLeft={2}>
                        <Text color='green' bold>
                            Positions:
                        </Text>
                        {company.positions.length === 0 ? (
                            <Box marginLeft={2}>
                                <Text color='gray'>No positions</Text>
                            </Box>
                        ) : (
                            company.positions.map((p) => (
                                <Box key={company.id! + p.id!} marginLeft={2} flexDirection='column'>
                                    <Box>
                                        <Text color='yellow'>- </Text>
                                        <Text>
                                            <Text color='white' bold>
                                                {p.name}
                                            </Text>
                                        </Text>
                                    </Box>
                                    <Box marginLeft={2} flexDirection='column'>
                                        <Box>
                                            <Text color='blue'>Status: </Text>
                                            <Text color={getStatusColor(p.status)}>{p.status}</Text>
                                        </Box>
                                        <Box>
                                            <Text color='magenta'>Tier: </Text>
                                            <Text color={getTierColor(p.tier)} bold>
                                                {p.tier}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Text color='cyan'>URL: </Text>
                                            <Text color='gray'>{p.url}</Text>
                                        </Box>
                                        <Box>
                                            <Text color='green'>Created Date: </Text>
                                            <Text color='gray'>{formatDate(p.createdDate)}</Text>
                                        </Box>
                                        <Box>
                                            <Text color='yellow'>Last Updated: </Text>
                                            <Text color='gray'>{formatDate(p.lastUpdated)}</Text>
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    )
}

// Helper functions for formatting
const getStatusColor = (status: IPosition['status']) => {
    switch (status) {
        case 'active':
            return 'green'
        case 'filled':
            return 'red'
        case 'rejected':
            return 'red'
        case 'accepted':
            return 'green'
        default:
            return 'white'
    }
}

const getTierColor = (tier: IPosition['tier']) => {
    switch (tier) {
        case 'S':
            return 'yellow'
        case 'A':
            return 'cyan'
        case 'B':
            return 'blue'
        default:
            return 'white'
    }
}

const formatDate = (dateString: string) => {
    try {
        const date = new Date(Number(dateString))
        return date.toLocaleDateString()
    } catch {
        return dateString
    }
}
