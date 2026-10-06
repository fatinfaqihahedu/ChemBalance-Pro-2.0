import { QuizAttemptRecord, StudentMasterRecord } from '../data/chemistryData';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates and downloads a multi-sheet Microsoft Excel (.xls SpreadsheetML) workbook
 * containing both the Revised Student Records (by Class & Name) and the Chronological Attempts Log.
 */
export function downloadStudentRecordsExcel(
  masterRecords: StudentMasterRecord[],
  attemptsLog: QuizAttemptRecord[],
  classFilterLabel: string = 'All_Classes'
) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeFilter = classFilterLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `ChemBalance_Pro_2.0_Cambridge_IGCSE_Records_${safeFilter}_${dateStr}.xls`;

  const masterRowsXml = masterRecords
    .map((rec) => {
      const c1 = rec.chapters['bab1'];
      const c2 = rec.chapters['bab2'];
      const c3 = rec.chapters['bab3'];
      const c4 = rec.chapters['bab4'];

      return `
        <Row>
          <Cell><Data ss:Type="String">${escapeXml(rec.studentClass)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(rec.studentName)}</Data></Cell>
          <Cell><Data ss:Type="${c1 ? 'Number' : 'String'}">${c1 ? c1.latestScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c1 && c1.previousScorePercent !== null ? 'Number' : 'String'}">${c1 && c1.previousScorePercent !== null ? c1.previousScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c2 ? 'Number' : 'String'}">${c2 ? c2.latestScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c2 && c2.previousScorePercent !== null ? 'Number' : 'String'}">${c2 && c2.previousScorePercent !== null ? c2.previousScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c3 ? 'Number' : 'String'}">${c3 ? c3.latestScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c3 && c3.previousScorePercent !== null ? 'Number' : 'String'}">${c3 && c3.previousScorePercent !== null ? c3.previousScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c4 ? 'Number' : 'String'}">${c4 ? c4.latestScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="${c4 && c4.previousScorePercent !== null ? 'Number' : 'String'}">${c4 && c4.previousScorePercent !== null ? c4.previousScorePercent : '-'}</Data></Cell>
          <Cell><Data ss:Type="Number">${rec.totalAttempts}</Data></Cell>
          <Cell><Data ss:Type="Number">${rec.overallAverageLatest}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(rec.lastActiveTimestamp.slice(0, 16).replace('T', ' '))}</Data></Cell>
        </Row>`;
    })
    .join('');

  const attemptRowsXml = [...attemptsLog]
    .reverse()
    .map((att) => {
      const chapName = att.chapterId.replace('bab', 'Chapter 0');
      return `
        <Row>
          <Cell><Data ss:Type="String">${escapeXml(att.studentClass || '305')}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(att.studentName)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(chapName)}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(att.dateLabel)}</Data></Cell>
          <Cell><Data ss:Type="Number">${att.correctCount}</Data></Cell>
          <Cell><Data ss:Type="Number">${att.totalQuestions}</Data></Cell>
          <Cell><Data ss:Type="Number">${att.scorePercent}</Data></Cell>
          <Cell><Data ss:Type="String">${escapeXml(att.timestamp.slice(0, 16).replace('T', ' '))}</Data></Cell>
        </Row>`;
    })
    .join('');

  const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0284C7" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Revised Student Records">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Class</Data></Cell>
    <Cell><Data ss:Type="String">Student Name</Data></Cell>
    <Cell><Data ss:Type="String">Ch 01 Revised (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 01 Previous (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 02 Revised (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 02 Previous (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 03 Revised (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 03 Previous (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 04 Revised (%)</Data></Cell>
    <Cell><Data ss:Type="String">Ch 04 Previous (%)</Data></Cell>
    <Cell><Data ss:Type="String">Total Attempts</Data></Cell>
    <Cell><Data ss:Type="String">Overall Average (%)</Data></Cell>
    <Cell><Data ss:Type="String">Last Updated</Data></Cell>
   </Row>
   ${masterRowsXml}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="All Quiz Attempts Log">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Class</Data></Cell>
    <Cell><Data ss:Type="String">Student Name</Data></Cell>
    <Cell><Data ss:Type="String">Chapter</Data></Cell>
    <Cell><Data ss:Type="String">Attempt Number</Data></Cell>
    <Cell><Data ss:Type="String">Correct Answers</Data></Cell>
    <Cell><Data ss:Type="String">Total Questions</Data></Cell>
    <Cell><Data ss:Type="String">Score (%)</Data></Cell>
    <Cell><Data ss:Type="String">Timestamp</Data></Cell>
   </Row>
   ${attemptRowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([workbookXml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a standard CSV softcopy of the Revised Student Records.
 */
export function downloadStudentRecordsCsv(
  masterRecords: StudentMasterRecord[],
  classFilterLabel: string = 'All_Classes'
) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeFilter = classFilterLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `ChemBalance_Pro_2.0_Cambridge_IGCSE_Records_${safeFilter}_${dateStr}.csv`;

  const headers = [
    'Class',
    'Student Name',
    'Ch 01 Revised (%)',
    'Ch 01 Previous (%)',
    'Ch 02 Revised (%)',
    'Ch 02 Previous (%)',
    'Ch 03 Revised (%)',
    'Ch 03 Previous (%)',
    'Ch 04 Revised (%)',
    'Ch 04 Previous (%)',
    'Total Attempts',
    'Overall Average (%)',
    'Last Updated',
  ];

  const rows = masterRecords.map((rec) => {
    const c1 = rec.chapters['bab1'];
    const c2 = rec.chapters['bab2'];
    const c3 = rec.chapters['bab3'];
    const c4 = rec.chapters['bab4'];

    const cols = [
      rec.studentClass,
      rec.studentName,
      c1 ? String(c1.latestScorePercent) : '-',
      c1 && c1.previousScorePercent !== null ? String(c1.previousScorePercent) : '-',
      c2 ? String(c2.latestScorePercent) : '-',
      c2 && c2.previousScorePercent !== null ? String(c2.previousScorePercent) : '-',
      c3 ? String(c3.latestScorePercent) : '-',
      c3 && c3.previousScorePercent !== null ? String(c3.previousScorePercent) : '-',
      c4 ? String(c4.latestScorePercent) : '-',
      c4 && c4.previousScorePercent !== null ? String(c4.previousScorePercent) : '-',
      String(rec.totalAttempts),
      String(rec.overallAverageLatest),
      rec.lastActiveTimestamp.slice(0, 16).replace('T', ' '),
    ];

    return cols.map((val) => `"${val.replace(/"/g, '""')}"`).join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
