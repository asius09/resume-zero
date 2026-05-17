import * as pdfjsLib from 'pdfjs-dist';
import type { ResumeData } from '@resume/types';
import { INITIAL_DATA } from '@/lib/constants';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    let pageText = '';
    let lastY = -1;
    
    for (const item of textContent.items as any[]) {
      // Check for new line based on hasEOL or significant Y coordinate change
      if (lastY !== -1 && Math.abs(lastY - item.transform[5]) > 5) {
        pageText += '\n';
      }
      
      // Add the text. Let the PDF's own item.str spaces dictate word boundaries
      pageText += item.str;
      
      if (item.hasEOL) {
        pageText += '\n';
        lastY = -1; // Reset lastY since we already added a newline
      } else {
        lastY = item.transform[5];
      }
    }
    
    fullText += pageText + '\n';
  }
  
  return fullText;
}

export function parseResumeTextToData(text: string): Partial<ResumeData> {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const resumeData: Partial<ResumeData> = {
    ...INITIAL_DATA,
    id: crypto.randomUUID(),
    metadata: {
      ...INITIAL_DATA.metadata,
      name: 'Imported Resume',
      lastModified: new Date().toISOString(),
    },
    blocks: [],
  };

  let currentSection = '';
  let currentBlock: any = null;
  let currentItems: any[] = [];
  let currentBullets: string[] = [];

  // Patterns for different sections (more forgiving)
  const sectionPatterns = {
    summary: /^(professional summary|summary|profile|objective|about|about me)$/i,
    experience: /^(work experience|experience|employment history|employment|career history|professional experience)$/i,
    education: /^(education|academic background|academic history|qualifications|degree)$/i,
    skills: /^(skills|technologies|technical skills|core competencies|expertise|tools)$/i,
    projects: /^(projects|personal projects|portfolio|works)$/i,
    certifications: /^(certifications|certificates|certs|licenses)$/i,
    languages: /^(languages|language proficiency)$/i,
    personal: /^(personal|personal information|personal details|hobbies|interests|extra-curricular)$/i,
    // Header pattern is usually handled differently, but we can keep a fallback
    header: /^(contact|details|personal info)$/i,
  };

  // Email pattern
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  // Phone pattern
  const phonePattern = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
  // URL pattern
  const urlPattern = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  // Extract header information
  const headerBlock: any = {
    type: 'header',
    data: {
      fullName: '',
      location: '',
      contacts: [],
    },
  };

  let headerLines: string[] = [];
  let headerComplete = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a section header
    const matchedSection = Object.entries(sectionPatterns).find(([_, pattern]) => pattern.test(line));
    
    if (matchedSection) {
      // Save previous section if exists
      if (currentSection && currentBlock) {
        if (currentSection === 'experience' || currentSection === 'projects') {
          currentBlock.data = [...currentItems];
        } else if (currentSection === 'skills') {
          currentBlock.data = currentItems;
        } else if (currentSection === 'education') {
          currentBlock.data = currentItems;
        } else if (currentSection === 'certifications') {
          currentBlock.data = currentItems;
        } else if (currentSection === 'languages') {
          currentBlock.data = currentItems;
        } else if (currentSection === 'personal') {
          currentBlock.data = currentItems;
        } else if (currentSection === 'summary') {
          currentBlock.data = currentBullets.join(' ');
        }
        resumeData.blocks?.push(currentBlock);
      }

      // Start new section
      currentSection = matchedSection[0];
      currentItems = [];
      currentBullets = [];
      
      switch (currentSection) {
        case 'header':
          if (!headerComplete) {
            headerBlock.data.fullName = headerLines[0] || '';
            
            const joinedHeader = headerLines.slice(1).join(' ');
            
            // email
            const emailMatch = joinedHeader.match(emailPattern);
            if (emailMatch) headerBlock.data.contacts.push({ type: 'email', value: emailMatch[0] });
            
            // phone
            const phoneMatch = joinedHeader.match(phonePattern);
            if (phoneMatch) headerBlock.data.contacts.push({ type: 'phone', value: phoneMatch[0] });
            
            // url
            const urlMatch = joinedHeader.match(urlPattern);
            if (urlMatch) {
              const hl = urlMatch[0];
              const type = hl.toLowerCase().includes('linkedin') ? 'linkedin' : hl.toLowerCase().includes('github') ? 'github' : 'website';
              headerBlock.data.contacts.push({ type, value: hl });
            }

            // location is essentially everything else, or just take the second line if it exists
            // To be safe, just set it to the raw second line
            headerBlock.data.location = headerLines[1] || '';
            
            resumeData.blocks?.push(headerBlock);
            headerComplete = true;
          }
          break;
        case 'summary':
          currentBlock = { type: 'summary', data: '' };
          break;
        case 'experience':
          currentBlock = { type: 'experience', data: [] };
          break;
        case 'education':
          currentBlock = { type: 'education', data: [] };
          break;
        case 'skills':
          currentBlock = { type: 'skills', data: [] };
          break;
        case 'projects':
          currentBlock = { type: 'projects', data: [] };
          break;
        case 'certifications':
          currentBlock = { type: 'certifications', data: [] };
          break;
        case 'languages':
          currentBlock = { type: 'languages', data: [] };
          break;
        case 'personal':
          currentBlock = { type: 'personal', data: [] };
          break;
      }
      continue;
    }

    // Collect header lines before any section
    if (!currentSection && !headerComplete) {
      headerLines.push(line);
      continue;
    }

    // Process content based on current section
    if (currentSection === 'summary') {
      currentBullets.push(line);
    } else if (currentSection === 'skills') {
      // Try to group skills by category
      if (line.includes(':') || line.includes('-')) {
        const parts = line.split(/[:\-]/);
        if (parts.length >= 2) {
          const category = parts[0].replace(/^[•\-\*\s]+/, '').trim();
          const skills = parts[1].split(',').map(s => s.trim()).filter(s => s);
          currentItems.push({ category, skills });
        }
      } else {
        // Add to existing category or create new
        if (currentItems.length === 0) {
          currentItems.push({ category: 'Technical Skills', skills: [line.replace(/^[•\-\*\s]+/, '')] });
        } else {
          currentItems[0].skills.push(line.replace(/^[•\-\*\s]+/, ''));
        }
      }
    } else if (currentSection === 'experience' || currentSection === 'projects') {
      const cleanLine = line.trim();
      if (cleanLine.length < 2) continue; // Skip garbage lines
      
      const datePattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\b(?:19|20)\d{2}\b)\s*(?:-|–|to)?\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\b(?:19|20)\d{2}\b|Present|Current)?/i;
      const dateMatch = cleanLine.match(datePattern);
      const extractedStartDate = dateMatch ? dateMatch[1]?.trim() || '' : '';
      const extractedEndDate = dateMatch ? dateMatch[2]?.trim() || '' : '';
      const isCurrent = extractedEndDate.toLowerCase() === 'present' || extractedEndDate.toLowerCase() === 'current';
      
      const textWithoutDate = cleanLine.replace(datePattern, '').replace(/^[-–\|\s]+|[-–\|\s]+$/g, '').replace(/\s+/g, ' ').trim();
      
      const isBullet = cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*') || /^\d+\./.test(cleanLine);
      const titlePattern = /^(.+?)\s+(at|@)\s+(.+?)\s*$/i;
      const titleMatch = textWithoutDate.match(titlePattern);
      
      if (titleMatch) {
        if (currentSection === 'experience') {
          currentItems.push({ jobTitle: titleMatch[1].trim(), companyName: titleMatch[3].trim(), location: '', startDate: extractedStartDate, endDate: extractedEndDate, isCurrent, bullets: [] });
        } else {
          currentItems.push({ name: titleMatch[1].trim(), description: titleMatch[3].trim(), techStack: [], bullets: [] });
        }
      } else if (isBullet || (currentItems.length > 0 && currentItems[currentItems.length - 1].companyName && !extractedStartDate)) {
        // If it's a bullet, or we already have company/description filled and it has no date, it's a bullet.
        const bullet = cleanLine.replace(/^[•\-\*\d+\.\s]+/, '').trim();
        if (bullet && currentItems.length > 0) {
          currentItems[currentItems.length - 1].bullets.push(bullet);
        }
      } else {
        if (currentItems.length === 0) {
          if (currentSection === 'experience') {
            currentItems.push({ jobTitle: textWithoutDate || cleanLine, companyName: '', location: '', startDate: extractedStartDate, endDate: extractedEndDate, isCurrent, bullets: [] });
          } else {
            currentItems.push({ name: textWithoutDate || cleanLine, description: '', techStack: [], bullets: [] });
          }
        } else {
          const lastItem = currentItems[currentItems.length - 1];
          if (currentSection === 'experience') {
            if (extractedStartDate && !lastItem.startDate) {
              lastItem.startDate = extractedStartDate;
              lastItem.endDate = extractedEndDate;
              lastItem.isCurrent = isCurrent;
            }
            
            if (textWithoutDate.length > 2) {
               if (!lastItem.companyName && textWithoutDate !== lastItem.jobTitle) lastItem.companyName = textWithoutDate;
               else if (textWithoutDate !== lastItem.jobTitle) lastItem.bullets.push(textWithoutDate);
            }
          } else {
            if (textWithoutDate.length > 2) {
               if (!lastItem.description && textWithoutDate !== lastItem.name) lastItem.description = textWithoutDate;
               else if (textWithoutDate !== lastItem.name) lastItem.bullets.push(textWithoutDate);
            }
          }
        }
      }
    } else if (currentSection === 'education') {
      const degreePattern = /^(.+?)\s+(in|from|at|–|-)\s+(.+?)$/;
      const degreeMatch = line.match(degreePattern);
      
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      const extractedYear = yearMatch ? yearMatch[0] : '';
      const cleanLine = line.replace(/\b(19|20)\d{2}\b/, '').replace(/[\(\)]/g, '').trim();
      
      if (degreeMatch) {
        currentItems.push({ degree: degreeMatch[1].trim(), institution: degreeMatch[3].trim(), location: '', graduationYear: extractedYear || new Date().getFullYear().toString(), isPursuing: false });
      } else if (line.trim().match(/^(19|20)\d{2}$/) && currentItems.length > 0) {
        currentItems[currentItems.length - 1].graduationYear = line.trim();
      } else if (cleanLine.length > 2) {
        if (currentItems.length === 0 || (currentItems[currentItems.length - 1].institution && currentItems[currentItems.length - 1].degree !== cleanLine)) {
          currentItems.push({ degree: cleanLine, institution: '', location: '', graduationYear: extractedYear || new Date().getFullYear().toString(), isPursuing: false });
        } else {
          currentItems[currentItems.length - 1].institution = cleanLine;
          if (extractedYear) currentItems[currentItems.length - 1].graduationYear = extractedYear;
        }
      }
    } else if (currentSection === 'certifications') {
      const certPattern = /^(.+?)\s*(\-|–|from|by)\s*(.+?)\s*(\d{4})?$/;
      const certMatch = line.match(certPattern);
      
      if (certMatch) {
        currentItems.push({ name: certMatch[1].trim(), issuer: certMatch[3].trim(), year: certMatch[4] || new Date().getFullYear().toString() });
      } else if (line.length > 2) {
        if (currentItems.length === 0 || currentItems[currentItems.length - 1].issuer) {
          currentItems.push({ name: line, issuer: '', year: new Date().getFullYear().toString() });
        } else {
          currentItems[currentItems.length - 1].issuer = line;
        }
      }
    } else if (currentSection === 'languages') {
      const cleanLine = line.replace(/^[•\-\*\s]+/, '').replace(/[\(\)]/g, '').trim();
      const parts = cleanLine.split(/[\-–:]/);
      if (parts.length >= 2) {
        currentItems.push({ language: parts[0].trim(), proficiency: parts[1].trim() });
      } else if (cleanLine.length > 2) {
        // If it's just a word like "English", add it. If the previous item has no proficiency (or is default), maybe it's the proficiency.
        const lastItem = currentItems[currentItems.length - 1];
        if (lastItem && (lastItem.proficiency === 'Native' || lastItem.proficiency === 'Intermediate') && cleanLine.match(/^(native|fluent|intermediate|beginner|proficient)$/i)) {
          lastItem.proficiency = cleanLine;
        } else {
          currentItems.push({ language: cleanLine, proficiency: 'Intermediate' });
        }
      }
    } else if (currentSection === 'personal') {
      // Treat personal info like a list of details
      if (line.includes(':') || line.includes('-')) {
        const parts = line.split(/[:\-]/);
        if (parts.length >= 2) {
          currentItems.push({
            label: parts[0].trim(),
            value: parts[1].trim(),
          });
        }
      } else if (line.length > 2) {
        currentItems.push({
          label: 'Detail',
          value: line,
        });
      }
    }
  }

  // Don't forget the last section
  if (currentSection && currentBlock) {
    if (currentSection === 'experience' || currentSection === 'projects') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'skills') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'education') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'certifications') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'languages') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'personal') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'summary') {
      currentBlock.data = currentBullets.join(' ');
    }
    resumeData.blocks?.push(currentBlock);
  }

  // Ensure we have at least a header block
  if (!headerComplete && headerLines.length > 0) {
    headerBlock.data.fullName = headerLines[0] || '';
    headerBlock.data.location = headerLines[1] || '';
    resumeData.blocks?.unshift(headerBlock);
  }

  return resumeData;
}
