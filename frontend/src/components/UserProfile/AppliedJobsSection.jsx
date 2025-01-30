import { Typography, Box, Paper, Stack } from "@mui/material";

const AppliedJobsSection = () => {
  return (
    <Box marginTop={4} width="100%">
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Applied Jobs
      </Typography>
      <Stack direction="column" spacing={2} marginTop={2}>
        <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Software Engineer at Tech Corp
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Applied on 2023-10-01
          </Typography>
        </Paper>
        <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Data Scientist at Data Inc
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Applied on 2023-09-25
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default AppliedJobsSection;
