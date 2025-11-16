import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TrendData } from '../types';

const COUNTRIES = {
  korea: '한국',
  usa: '미국',
  japan: '일본',
  china: '중국'
};

export const exportToPDF = (trends: TrendData[], title: string = '웹 트렌드 분석') => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text(title, 14, 20);

  // Subtitle
  doc.setFontSize(12);
  doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 14, 30);

  let yPosition = 40;

  trends.forEach((trend, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Country and Decade
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(
      `${COUNTRIES[trend.country]} - ${trend.decade}`,
      14,
      yPosition
    );
    yPosition += 8;

    // Title
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(trend.title, 14, yPosition);
    yPosition += 8;

    // Description
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(trend.description, 180);
    doc.text(descriptionLines, 14, yPosition);
    yPosition += (descriptionLines.length * 5) + 5;

    // Websites Table
    if (trend.websites.length > 0) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('주요 웹사이트:', 14, yPosition);
      yPosition += 5;

      const websiteData = trend.websites.map(site => [
        site.name,
        site.category,
        site.description
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['이름', '카테고리', '설명']],
        body: websiteData,
        theme: 'grid',
        headStyles: { fillColor: [14, 165, 233] },
        margin: { left: 14 },
        styles: { fontSize: 9 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Design Trends
    if (trend.design_trends.length > 0 && yPosition < 260) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('디자인 트렌드:', 14, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(trend.design_trends.join(', '), 14, yPosition);
      yPosition += 8;
    }

    // Tech Stack
    if (trend.tech_stack.length > 0 && yPosition < 260) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('기술 스택:', 14, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(trend.tech_stack.join(', '), 14, yPosition);
      yPosition += 10;
    }

    // Add separator if not last item
    if (index < trends.length - 1) {
      doc.setDrawColor(200);
      doc.line(14, yPosition, 196, yPosition);
      yPosition += 10;
    }
  });

  // Save PDF
  const filename = `web-trends-${new Date().getTime()}.pdf`;
  doc.save(filename);
};

export const exportToExcel = (trends: TrendData[], filename: string = 'web-trends') => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = trends.map(trend => ({
    '시대': trend.decade,
    '국가': COUNTRIES[trend.country],
    '제목': trend.title,
    '웹사이트 수': trend.websites.length,
    '기술 스택 수': trend.tech_stack.length,
    '디자인 트렌드 수': trend.design_trends.length
  }));

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, '요약');

  // Detailed Trends Sheet
  const detailedData = trends.map(trend => ({
    '시대': trend.decade,
    '국가': COUNTRIES[trend.country],
    '제목': trend.title,
    '설명': trend.description,
    '디자인 트렌드': trend.design_trends.join(', '),
    '기술 스택': trend.tech_stack.join(', '),
    '사용자 행동': trend.user_behavior.join(', ')
  }));

  const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(wb, detailedSheet, '상세 데이터');

  // Websites Sheet
  const websitesData: any[] = [];
  trends.forEach(trend => {
    trend.websites.forEach(site => {
      websitesData.push({
        '시대': trend.decade,
        '국가': COUNTRIES[trend.country],
        '웹사이트': site.name,
        '카테고리': site.category,
        '설명': site.description,
        '출시년도': site.launch_year
      });
    });
  });

  if (websitesData.length > 0) {
    const websitesSheet = XLSX.utils.json_to_sheet(websitesData);
    XLSX.utils.book_append_sheet(wb, websitesSheet, '웹사이트 목록');
  }

  // Save Excel file
  const excelFilename = `${filename}-${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, excelFilename);
};

export const exportToJSON = (trends: TrendData[], filename: string = 'web-trends') => {
  const dataStr = JSON.stringify(trends, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().getTime()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
