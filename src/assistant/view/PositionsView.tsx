import React, {useEffect, useState} from 'react'
import {ICompany} from '../models/Company.js'
import {IPosition} from '../models/Position.js'
import {Box, Text} from 'ink'
import {PaginatedList} from './components/Pager.js'
import {PaginationInstructions} from './PaginationInstructions.js'

export interface PositionsViewProps {
    company: ICompany
}

export const PositionsView: React.FC<PositionsViewProps> = (props: PositionsViewProps) => {
    const {company} = props

    return (
        <Box flexDirection='column'>
            <PaginationInstructions />

            <Box flexDirection='row' alignItems='flex-start' justifyContent='flex-start' marginBottom={1} paddingX={2}>
                <Text>
                    <Text color='cyanBright' bold>
                        Total Positions Applied Under {company.company}:
                    </Text>{' '}
                    <Text color='white' bold>
                        {company.positions.length}
                    </Text>
                </Text>
            </Box>
            {company.positions.length === 0 ? (
                <Box marginLeft={2}>
                    <Text color='gray'>No positions</Text>
                </Box>
            ) : (
                <PaginatedList list={company.positions} pageSize={1} isCursorOn={true}>
                    {({data}) => (
                        <>
                            {data.map(p => (
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
                            ))}
                        </>
                    )}
                </PaginatedList>
            )}
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
