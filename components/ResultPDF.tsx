"use client";

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  summaryText: {
    fontSize: 12,
    marginBottom: 5,
  }
});

const ResultPDF = ({ semester }: { semester: string }) => {
  const userData = useQuery(api.users.getCurrentUser);
  const currentStudent = useQuery(api.students.getCurrentStudent);
  const results = useQuery(api.results.getStudentResults, 
    currentStudent ? { studentId: currentStudent._id, semester } : "skip"
  );
  const cgpa = useQuery(api.results.calculateStudentCGPA, 
    currentStudent ? { studentId: currentStudent._id, semester } : "skip"
  );

  if (!userData || !currentStudent || !results || !cgpa) {
    return null;
  }

  const totalCreditUnits = results.reduce((sum, result) => sum + result.creditUnit, 0);

  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>HAKIMI HEALTH COLLEGE</Text>
            <Text style={styles.title}>Academic Result</Text>
            <Text style={styles.subtitle}>{currentStudent.programName}</Text>
            <Text style={styles.subtitle}>{semester}</Text>
            <Text style={styles.subtitle}>Student ID: {currentStudent.applicationNumber}</Text>
            <Text style={styles.subtitle}>Name: {userData.name}</Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Course Code</Text>
              <Text style={styles.tableCell}>Course Name</Text>
              <Text style={styles.tableCell}>Credit Unit</Text>
              <Text style={styles.tableCell}>CA</Text>
              <Text style={styles.tableCell}>Exam</Text>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCell}>Grade</Text>
              <Text style={styles.tableCell}>Grade Point</Text>
            </View>

            {results.map((result, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{result.courseCode}</Text>
                <Text style={styles.tableCell}>{result.courseName}</Text>
                <Text style={styles.tableCell}>{result.creditUnit}</Text>
                <Text style={styles.tableCell}>{result.caMark}</Text>
                <Text style={styles.tableCell}>{result.examMark}</Text>
                <Text style={styles.tableCell}>{result.totalMark}</Text>
                <Text style={styles.tableCell}>{result.grade}</Text>
                <Text style={styles.tableCell}>{result.gradePoint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total Credit Units: {totalCreditUnits}</Text>
            <Text style={styles.summaryText}>CGPA: {cgpa.cgpa.toFixed(2)}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ResultPDF; 