"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Box,
  Skeleton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: "600px",
  margin: "0 auto",
  marginTop: theme.spacing(8),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(3),
  border: `4px solid ${theme.palette.primary.main}`,
}));

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <StyledCard>
        <CardHeader
          avatar={
            <StyledAvatar
              src={user?.imageUrl}
              alt={user?.fullName ?? "User"}
            >
              {user?.fullName?.[0] ?? "U"}
            </StyledAvatar>
          }
          title={
            <Typography variant="h4" component="div">
              {user?.fullName}
            </Typography>
          }
          subheader={
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "capitalize", color: "primary.main" }}
            >
              {user?.primaryEmailAddress?.emailAddress}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Typography variant="h6" sx={{ textTransform: "capitalize", color: "text.secondary" }}>
            Role: {user?.publicMetadata?.role || "User"}
          </Typography>
        </CardContent>
      </StyledCard>
    </Box>
  );
}

function ProfileSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <StyledCard>
        <CardHeader
          avatar={<Skeleton variant="circular" width={120} height={120} />}
          title={<Skeleton variant="text" width={200} height={40} />}
          subheader={<Skeleton variant="text" width={100} height={24} />}
        />
        <Divider />
        <CardContent>
          <Skeleton variant="text" width={100} height={24} />
        </CardContent>
      </StyledCard>
    </Box>
  );
} 