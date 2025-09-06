import {Text, Box} from 'ink'

export const PaginationInstructions = () => {
    return (
        <Box flexDirection='row' alignItems='flex-start' justifyContent='flex-start' marginBottom={1} paddingX={2}>
            <Text>
                <Text color='magentaBright' bold>
                    👇
                </Text>
                {'  '}
                <Text color='yellow' bold>
                    Arrow Down
                </Text>
                {' / '}
                <Text color='yellow' bold>
                    Arrow Up
                </Text>{' '}
                <Text color='magentaBright' bold>
                    👆
                </Text>
                {'  '}
                <Text color='gray'>to scroll through jobs</Text>
            </Text>
        </Box>
    )
}
