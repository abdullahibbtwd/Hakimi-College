"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Box, Typography, List, ListItem, ListItemText, Divider, Chip } from "@mui/material";

const StudentCourses = () => {
  const userData = useQuery(api.users.getCurrentUser);
  const currentStudent = useQuery(api.students.getCurrentStudent);
  const courses = useQuery(api.courses.getCourses);

  if (!userData || !currentStudent || !courses) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading courses...</Typography>
      </Box>
    );
  }

  // Separate courses into program-specific and general courses
  const programCourses = courses.filter(course => 
    course.programIds.includes(currentStudent.programId) && !course.isGeneral
  );

  const generalCourses = courses.filter(course => 
    course.isGeneral
  );

  return (
    <Box sx={{ 
      bgcolor: 'white', 
      borderRadius: 1, 
      p: 2,
      height: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        My Courses
      </Typography>

      {/* Program Courses */}
      {programCourses.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Program Courses
          </Typography>
          <List>
            {programCourses.map((course, index) => (
              <Box key={course._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {course.code}
                        <Chip 
                          label="Program" 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            bgcolor: '#FAE27C',
                            color: '#000'
                          }} 
                        />
                      </Box>
                    }
                    secondary={course.name}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: 'medium'
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.8rem',
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                {index < programCourses.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </>
      )}

      {/* General Courses */}
      {generalCourses.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
            General Courses
          </Typography>
          <List>
            {generalCourses.map((course, index) => (
              <Box key={course._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {course.code}
                        <Chip 
                          label="General" 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            bgcolor: '#E3F2FD',
                            color: '#1976D2'
                          }} 
                        />
                      </Box>
                    }
                    secondary={course.name}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: 'medium'
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.8rem',
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                {index < generalCourses.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default StudentCourses; 