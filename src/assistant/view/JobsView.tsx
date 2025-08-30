import { Level, ValueIterator } from "level";
import React, { useEffect } from "react";
import { ICompany } from "../models/Company.js";
import { IPosition } from "../models/Position.js";
import { Box, Text } from "ink";

export interface JobsViewProps {
    positions: AsyncIterable<ICompany>
}

export const JobsView: React.FC<JobsViewProps> = (props: JobsViewProps) => {
    const { positions } = props;

    const [companies, setCompanies] = React.useState<ICompany[]>([]);

    useEffect(() => {
        let cancelled = false;
        // call asynchronously and update state as we go
        (async () => {
            for await (const company of positions) {
                if (cancelled) break;
                setCompanies(prev => [...prev, company]);
            }
        })();
        return () => { cancelled = true; };
    }, [positions]);

    return (
        <Box flexDirection="column">
            {companies.map((company, idx) => (
                <>
                    <Box
                        key={company.company + idx}
                        flexDirection="column"
                        borderStyle="round"
                        borderColor="cyan"
                        paddingX={1}
                        marginBottom={1}
                    >
                        <Text key={company.company + idx + "inner header"} color="cyan" bold>
                            Company: <Text color="white" bold>{company.company}</Text>
                        </Text>
                        <Box key={company.company + idx + "inner box"} flexDirection="column" marginLeft={2}>
                            <Text color="green" key={company.company + idx + "inner positions header"} bold>
                                Positions:
                            </Text>
                            {company.positions.length === 0 ? (
                                <Box marginLeft={2}>
                                    <Text key={company.company + "empty"} color="gray">No positions</Text>
                                </Box>
                            ) : (
                                company.positions.map((p, posIdx) => (
                                    <Box key={company.company + p.name + posIdx} marginLeft={2} flexDirection="column">
                                        <Box>
                                            <Text color="yellow">- </Text>
                                            <Text>
                                                <Text color="white" bold>{p.name}</Text>
                                            </Text>
                                        </Box>
                                        <Box marginLeft={2} flexDirection="column">
                                            <Box>
                                                <Text color="blue">Status: </Text>
                                                <Text color={getStatusColor(p.status)}>{p.status}</Text>
                                            </Box>
                                            <Box>
                                                <Text color="magenta">Tier: </Text>
                                                <Text color={getTierColor(p.tier)} bold>{p.tier}</Text>
                                            </Box>
                                            <Box>
                                                <Text color="cyan">URL: </Text>
                                                <Text color="gray">{p.url}</Text>
                                            </Box>
                                            <Box>
                                                <Text color="green">Last Checked: </Text>
                                                <Text color="gray">{formatDate(p.lastChecked)}</Text>
                                            </Box>
                                            <Box>
                                                <Text color="yellow">Last Updated: </Text>
                                                <Text color="gray">{formatDate(p.lastUpdated)}</Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Box>
                </>
            ))}
        </Box>
    );
}

// Helper functions for formatting
const getStatusColor = (status: IPosition['status']) => {
    switch (status) {
        case 'active': return 'green';
        case 'filled': return 'red';
        case 'rejected': return 'red';
        case 'accepted': return 'green';
        default: return 'white';
    }
};

const getTierColor = (tier: IPosition['tier']) => {
    switch (tier) {
        case 'S': return 'yellow';
        case 'A': return 'cyan';
        case 'B': return 'blue';
        default: return 'white';
    }
};

const formatDate = (dateString: string) => {
    try {
        const date = new Date(Number(dateString));
        return date.toLocaleDateString();
    } catch {
        return dateString;
    }
};