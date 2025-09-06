import React, { useEffect, useState } from 'react'
import {ICompany} from '../models/Company.js'
import {Box, Text} from 'ink'
import { PaginatedList } from './components/Pager.js'
import { PaginationInstructions } from './PaginationInstructions.js'

export interface CompaniesViewProps {
    positions: AsyncIterable<ICompany>
}

export const CompaniesView: React.FC<CompaniesViewProps> = (props: CompaniesViewProps) => {
    const {positions} = props

    const [companies, setCompanies] = useState<ICompany[]>([])

    const [companyCount, setCompanyCount] = useState<number>(0);

    useEffect(() => {
        let cancelled = false;
        // call asynchronously and update state as we go
        // this helps to not load everything early one, and only till now
        (async () => {
            for await (const company of positions) {
                if (cancelled) break

                setCompanyCount(prev => ++prev);

                setCompanies(prev => [...prev, company])
            }
        })()
        return () => {
            cancelled = true
        }
    }, [positions])

    return (
        <Box flexDirection='column'>

            <PaginationInstructions/>

            <Box
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="flex-start"
                marginBottom={1}
                paddingX={2}
            >
                <Text>
                    <Text color="cyanBright" bold>Total Companies Applied:</Text>
                    {" "}
                    <Text color="white" bold>{companyCount}</Text>
                </Text>
            </Box>
            <PaginatedList
                list={companies}
                pageSize={1}
                isCursorOn={true}
                >
                    {({data}) => (
                        <>
                            {data.map((company) => (
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
                                </Box>
                            ))}
                        </>
                    )}
            </PaginatedList>
        </Box>
    )
}
