import { Box } from '@chakra-ui/react';

const CenterWrapper = ({ children }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    position="absolute"
    height="100%"
    width="100%"
  >
    {children}
  </Box>
);

export default CenterWrapper;
