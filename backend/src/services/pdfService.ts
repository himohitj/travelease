import PDFDocument from 'pdfkit';
import { logger } from '../utils/logger';

export const generateItineraryPDF = async (itinerary: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header with Yatra Sathi branding
      doc.fontSize(28)
         .fillColor('#2563eb')
         .text('🧳 Yatra Sathi', 50, 50);

      doc.fontSize(16)
         .fillColor('#6b7280')
         .text('Your AI Travel Companion', 50, 85);

      // Title
      doc.fontSize(24)
         .fillColor('#000000')
         .text(`${itinerary.destination} Travel Itinerary`, 50, 130);

      // Trip Details
      doc.fontSize(12)
         .text(`Duration: ${itinerary.days} days`, 50, 170)
         .text(`Budget: ₹${itinerary.budget.toLocaleString()}`, 50, 190)
         .text(`Language: ${itinerary.language}`, 50, 210)
         .text(`Generated: ${new Date(itinerary.createdAt).toLocaleDateString()}`, 50, 230);

      let yPosition = 270;

      // Itinerary Plan
      if (itinerary.plan && itinerary.plan.dayPlans) {
        doc.fontSize(18)
           .fillColor('#1f2937')
           .text('📅 Day-wise Itinerary', 50, yPosition);
        
        yPosition += 40;

        itinerary.plan.dayPlans.forEach((day: any, index: number) => {
          // Check if we need a new page
          if (yPosition > 650) {
            doc.addPage();
            yPosition = 50;
          }

          // Day header
          doc.fontSize(16)
             .fillColor('#2563eb')
             .text(`Day ${day.day} - ${day.date}`, 50, yPosition);
          
          yPosition += 25;

          // Morning activities
          if (day.morning && day.morning.length > 0) {
            doc.fontSize(12)
               .fillColor('#059669')
               .text('🌅 Morning:', 70, yPosition);
            yPosition += 15;

            day.morning.forEach((activity: any) => {
              doc.fontSize(10)
                 .fillColor('#000000')
                 .text(`• ${activity.time} - ${activity.name}`, 90, yPosition);
              yPosition += 12;
              if (activity.location) {
                doc.fillColor('#6b7280')
                   .text(`  📍 ${activity.location}`, 90, yPosition);
                yPosition += 12;
              }
            });
            yPosition += 10;
          }

          // Afternoon activities
          if (day.afternoon && day.afternoon.length > 0) {
            doc.fontSize(12)
               .fillColor('#dc2626')
               .text('☀️ Afternoon:', 70, yPosition);
            yPosition += 15;

            day.afternoon.forEach((activity: any) => {
              doc.fontSize(10)
                 .fillColor('#000000')
                 .text(`• ${activity.time} - ${activity.name}`, 90, yPosition);
              yPosition += 12;
              if (activity.location) {
                doc.fillColor('#6b7280')
                   .text(`  📍 ${activity.location}`, 90, yPosition);
                yPosition += 12;
              }
            });
            yPosition += 10;
          }

          // Evening activities
          if (day.evening && day.evening.length > 0) {
            doc.fontSize(12)
               .fillColor('#7c3aed')
               .text('🌆 Evening:', 70, yPosition);
            yPosition += 15;

            day.evening.forEach((activity: any) => {
              doc.fontSize(10)
                 .fillColor('#000000')
                 .text(`• ${activity.time} - ${activity.name}`, 90, yPosition);
              yPosition += 12;
              if (activity.location) {
                doc.fillColor('#6b7280')
                   .text(`  📍 ${activity.location}`, 90, yPosition);
                yPosition += 12;
              }
            });
            yPosition += 10;
          }

          // Accommodation
          if (day.accommodation) {
            doc.fontSize(11)
               .fillColor('#1f2937')
               .text(`🏨 Stay: ${day.accommodation.name}`, 70, yPosition);
            yPosition += 15;
          }

          // Daily cost
          if (day.totalCost) {
            doc.fontSize(10)
               .fillColor('#059669')
               .text(`💰 Estimated Cost: ₹${day.totalCost.toLocaleString()}`, 70, yPosition);
            yPosition += 20;
          }

          yPosition += 10;
        });
      }

      // Tips section
      if (itinerary.plan && itinerary.plan.tips) {
        yPosition += 20;
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(16)
           .fillColor('#1f2937')
           .text('💡 Travel Tips', 50, yPosition);
        
        yPosition += 30;

        itinerary.plan.tips.forEach((tip: string, index: number) => {
          doc.fontSize(10)
             .fillColor('#000000')
             .text(`• ${tip}`, 70, yPosition);
          yPosition += 15;
        });
      }

      // Emergency contacts
      if (itinerary.plan && itinerary.plan.emergencyContacts) {
        yPosition += 20;
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(16)
           .fillColor('#dc2626')
           .text('🚨 Emergency Contacts', 50, yPosition);
        
        yPosition += 30;

        const contacts = itinerary.plan.emergencyContacts;
        Object.entries(contacts).forEach(([key, value]: [string, any]) => {
          doc.fontSize(10)
             .fillColor('#000000')
             .text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 70, yPosition);
          yPosition += 15;
        });
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .fillColor('#6b7280')
           .text('Generated by Yatra Sathi - Your AI Travel Companion', 50, 750);
        
        doc.text(`Page ${i + 1} of ${pageCount}`, 450, 750);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 765);
      }

      doc.end();

    } catch (error) {
      logger.error('Itinerary PDF generation error:', error);
      reject(error);
    }
  });
};

export const generateRoadmapPDF = async (roadmap: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header
      doc.fontSize(24)
         .fillColor('#2563eb')
         .text('TravelEase', 50, 50);

      doc.fontSize(20)
         .fillColor('#000000')
         .text(roadmap.title, 50, 100);

      // Trip Details
      doc.fontSize(12)
         .text(`Duration: ${new Date(roadmap.startDate).toLocaleDateString()} - ${new Date(roadmap.endDate).toLocaleDateString()}`, 50, 140);

      if (roadmap.budget) {
        doc.text(`Budget: ₹${roadmap.budget.toLocaleString()}`, 50, 160);
      }

      if (roadmap.description) {
        doc.text(`Description: ${roadmap.description}`, 50, 180);
      }

      let yPosition = 220;

      // Destinations
      if (roadmap.destinations && roadmap.destinations.length > 0) {
        doc.fontSize(16)
           .fillColor('#1f2937')
           .text('Destinations', 50, yPosition);
        
        yPosition += 30;

        roadmap.destinations.forEach((destination: any, index: number) => {
          doc.fontSize(12)
             .fillColor('#000000')
             .text(`${index + 1}. ${destination.name || destination}`, 70, yPosition);
          
          if (destination.description) {
            yPosition += 20;
            doc.fontSize(10)
               .fillColor('#6b7280')
               .text(destination.description, 90, yPosition);
          }
          
          yPosition += 25;

          // Add new page if needed
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }
        });
      }

      // Activities
      if (roadmap.activities && roadmap.activities.length > 0) {
        yPosition += 20;
        doc.fontSize(16)
           .fillColor('#1f2937')
           .text('Activities', 50, yPosition);
        
        yPosition += 30;

        roadmap.activities.forEach((activity: any, index: number) => {
          doc.fontSize(12)
             .fillColor('#000000')
             .text(`${index + 1}. ${activity.name || activity}`, 70, yPosition);
          
          yPosition += 20;

          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }
        });
      }

      // Hotels
      if (roadmap.hotels && roadmap.hotels.length > 0) {
        yPosition += 20;
        doc.fontSize(16)
           .fillColor('#1f2937')
           .text('Recommended Hotels', 50, yPosition);
        
        yPosition += 30;

        roadmap.hotels.forEach((hotel: any, index: number) => {
          doc.fontSize(12)
             .fillColor('#000000')
             .text(`${index + 1}. ${hotel.name}`, 70, yPosition);
          
          if (hotel.address) {
            yPosition += 15;
            doc.fontSize(10)
               .fillColor('#6b7280')
               .text(`Address: ${hotel.address}`, 90, yPosition);
          }

          if (hotel.pricePerNight) {
            yPosition += 15;
            doc.text(`Price: ₹${hotel.pricePerNight}/night`, 90, yPosition);
          }
          
          yPosition += 25;

          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }
        });
      }

      // Transport
      if (roadmap.transport && roadmap.transport.length > 0) {
        yPosition += 20;
        doc.fontSize(16)
           .fillColor('#1f2937')
           .text('Transportation', 50, yPosition);
        
        yPosition += 30;

        roadmap.transport.forEach((transport: any, index: number) => {
          doc.fontSize(12)
             .fillColor('#000000')
             .text(`${index + 1}. ${transport.type || transport.mode}`, 70, yPosition);
          
          if (transport.route) {
            yPosition += 15;
            doc.fontSize(10)
               .fillColor('#6b7280')
               .text(`Route: ${transport.route}`, 90, yPosition);
          }

          if (transport.estimatedCost) {
            yPosition += 15;
            doc.text(`Estimated Cost: ₹${transport.estimatedCost}`, 90, yPosition);
          }
          
          yPosition += 25;

          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }
        });
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .fillColor('#6b7280')
           .text(`Generated by TravelEase - Page ${i + 1} of ${pageCount}`, 50, 750);
        
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 400, 750);
      }

      doc.end();

    } catch (error) {
      logger.error('PDF generation error:', error);
      reject(error);
    }
  });
};