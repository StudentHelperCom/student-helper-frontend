import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import {SummaryBlock} from "@src/types/api-requests.types";

Font.register({
  family: 'Poppins',
  src: '/fonts/Poppins-Regular.ttf',
});

Font.register({
  family: 'Poppins-Bold',
  src: '/fonts/Poppins-Bold.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 1.5,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  list: {
    marginBottom: 8,
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 12,
  },
  listItemContent: {
    flex: 1,
  },
});

interface Props {
  data: SummaryBlock[];
}

export const SummaryPdfDocument = ({ data }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {data.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <Text key={index} style={styles.heading}>
                {block.value}
              </Text>
            );

          case 'text':
            return (
              <Text key={index} style={styles.text}>
                {block.value}
              </Text>
            );

          case 'list':
            return (
              <View key={index} style={styles.list}>
                {block.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listItemContent}>{item}</Text>
                  </View>
                ))}
              </View>
            );

          default:
            return null;
        }
      })}
    </Page>
  </Document>
);