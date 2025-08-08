import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { CallSheetWithRelations } from '@/lib/types/database'

// Register fonts for better typography
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v5/helvetica-regular.ttf',
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: 2,
    borderColor: '#000000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    padding: 5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  labelColumn: {
    width: '30%',
    fontWeight: 'bold',
  },
  valueColumn: {
    width: '70%',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'left',
  },
  sceneTable: {
    marginTop: 10,
  },
  notes: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF9C4',
    borderRadius: 5,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTop: 1,
    borderColor: '#CCCCCC',
    paddingTop: 10,
    fontSize: 8,
    color: '#666666',
  },
})

interface CallSheetPDFProps {
  callSheet: CallSheetWithRelations
}

export const CallSheetPDF = ({ callSheet }: CallSheetPDFProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{callSheet.title}</Text>
          <Text style={styles.subtitle}>CALL SHEET</Text>
          <Text>{formatDate(callSheet.shootDate)}</Text>
        </View>

        {/* Production Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Production Information</Text>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Shoot Date:</Text>
            <Text style={styles.valueColumn}>{formatDate(callSheet.shootDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Call Time:</Text>
            <Text style={styles.valueColumn}>{formatTime(callSheet.callTime)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Location:</Text>
            <Text style={styles.valueColumn}>{callSheet.location}</Text>
          </View>
          {callSheet.weather && (
            <View style={styles.row}>
              <Text style={styles.labelColumn}>Weather:</Text>
              <Text style={styles.valueColumn}>{callSheet.weather}</Text>
            </View>
          )}
          {callSheet.sunrise && (
            <View style={styles.row}>
              <Text style={styles.labelColumn}>Sunrise:</Text>
              <Text style={styles.valueColumn}>{callSheet.sunrise}</Text>
            </View>
          )}
          {callSheet.sunset && (
            <View style={styles.row}>
              <Text style={styles.labelColumn}>Sunset:</Text>
              <Text style={styles.valueColumn}>{callSheet.sunset}</Text>
            </View>
          )}
        </View>

        {/* Scenes */}
        {callSheet.scenes && callSheet.scenes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scenes</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Scene #</Text>
                </View>
                <View style={[styles.tableCol, { width: '35%' }]}>
                  <Text style={styles.tableCell}>Description</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>Location</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Time of Day</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text style={styles.tableCell}>Pages</Text>
                </View>
              </View>
              {callSheet.scenes.map((scene, index) => (
                <View key={scene.id} style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: '15%' }]}>
                    <Text style={styles.tableCell}>{scene.sceneNumber}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '35%' }]}>
                    <Text style={styles.tableCell}>{scene.description || '-'}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '20%' }]}>
                    <Text style={styles.tableCell}>{scene.location || '-'}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '15%' }]}>
                    <Text style={styles.tableCell}>{scene.timeOfDay || '-'}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '15%' }]}>
                    <Text style={styles.tableCell}>{scene.pages || '-'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* General Notes */}
        {callSheet.generalNotes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>General Notes</Text>
            <Text style={styles.notesText}>{callSheet.generalNotes}</Text>
          </View>
        )}

        {/* Safety Notes */}
        {callSheet.safetyNotes && (
          <View style={[styles.notes, { backgroundColor: '#FFE6E6', marginTop: 10 }]}>
            <Text style={styles.notesTitle}>⚠️ Safety Notes</Text>
            <Text style={styles.notesText}>{callSheet.safetyNotes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Slate • {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}