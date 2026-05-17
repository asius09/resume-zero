import * as pdfjsLib from 'pdfjs-dist';
import type { ResumeData } from '@resume/types';
import { INITIAL_DATA } from '@/lib/constants';

// Set up PDF.js worker - use local file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
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

  // Patterns for different sections
  const sectionPatterns = {
    header: /^(name|contact|email|phone|linkedin|github|location|address)$/i,
    summary: /^(summary|profile|objective|about)$/i,
    experience: /^(experience|work|employment|job|career)$/i,
    education: /^(education|academic|qualification|degree)$/i,
    skills: /^(skills|technologies|competencies|expertise)$/i,
    projects: /^(projects|portfolio|works)$/i,
    certifications: /(certifications|certificates|certs)/i,
    languages: /^(languages|language proficiency)$/i,
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
            headerBlock.data.location = headerLines[1] || '';
            
            // Extract contact info
            headerLines.slice(2).forEach(hl => {
              if (emailPattern.test(hl)) {
                headerBlock.data.contacts.push({ type: 'email', value: hl });
              } else if (phonePattern.test(hl)) {
                headerBlock.data.contacts.push({ type: 'phone', value: hl });
              } else if (urlPattern.test(hl)) {
                const type = hl.toLowerCase().includes('linkedin') ? 'linkedin' : 
                            hl.toLowerCase().includes('github') ? 'github' : 'website';
                headerBlock.data.contacts.push({ type, value: hl });
              }
            });
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
          const category = parts[0].trim();
          const skills = parts[1].split(',').map(s => s.trim()).filter(s => s);
          currentItems.push({ category, skills });
        }
      } else {
        // Add to existing category or create new
        if (currentItems.length === 0) {
          currentItems.push({ category: 'Technical Skills', skills: [line] });
        } else {
          currentItems[0].skills.push(line);
        }
      }
    } else if (currentSection === 'experience' || currentSection === 'projects') {
      // Check if line looks like a job/project title
      const titlePattern = /^(.+?)\s+(at|@|–|-)\s+(.+?)\s*(\(|\[)?/;
      const titleMatch = line.match(titlePattern);
      
      if (titleMatch) {
        // Save previous item if exists
        if (currentBullets.length > 0) {
          if (currentSection === 'experience') {
            currentItems.push({
              jobTitle: currentItems[currentItems.length - 1]?.jobTitle || '',
              companyName: currentItems[currentItems.length - 1]?.companyName || '',
              location: '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              bullets: currentBullets,
            });
          } else {
            currentItems.push({
              name: currentItems[currentItems.length - 1]?.name || '',
              description: '',
              techStack: [],
              bullets: currentBullets,
            });
          }
          currentBullets = [];
        }
        
        if (currentSection === 'experience') {
          currentItems.push({
            jobTitle: titleMatch[1].trim(),
            companyName: titleMatch[3].trim(),
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            bullets: [],
          });
        } else {
          currentItems.push({
            name: titleMatch[1].trim(),
            description: titleMatch[3].trim(),
            techStack: [],
            bullets: [],
          });
        }
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
        // It's a bullet point
        const bullet = line.replace(/^[•\-\*\d+\.\s]+/, '').trim();
        if (bullet) currentBullets.push(bullet);
      } else if (currentItems.length > 0) {
        // Add as bullet if not empty
        if (line.length > 0) currentBullets.push(line);
      }
    } else if (currentSection === 'education') {
      // Look for degree patterns
      const degreePattern = /^(.+?)\s+(in|from|at|–|-)\s+(.+?)$/;
      const degreeMatch = line.match(degreePattern);
      
      if (degreeMatch) {
        currentItems.push({
          degree: degreeMatch[1].trim(),
          institution: degreeMatch[3].trim(),
          location: '',
          graduationYear: new Date().getFullYear().toString(),
          isPursuing: false,
        });
      } else if (line.length > 10) {
        // Try to extract from any line
        currentItems.push({
          degree: line,
          institution: '',
          location: '',
          graduationYear: new Date().getFullYear().toString(),
          isPursuing: false,
        });
      }
    } else if (currentSection === 'certifications') {
      // Pattern: Certification Name - Issuer Year
      const certPattern = /^(.+?)\s*(\-|–|from|by)\s*(.+?)\s*(\d{4})?$/;
      const certMatch = line.match(certPattern);
      
      if (certMatch) {
        currentItems.push({
          name: certMatch[1].trim(),
          issuer: certMatch[3].trim(),
          year: certMatch[4] || new Date().getFullYear().toString(),
        });
      } else if (line.length > 5) {
        currentItems.push({
          name: line,
          issuer: '',
          year: new Date().getFullYear().toString(),
        });
      }
    } else if (currentSection === 'languages') {
      // Pattern: Language - Proficiency
      const langPattern = /^(.+?)\s*(\-|–|:)?\s*(.+?)$/;
      const langMatch = line.match(langPattern);
      
      if (langMatch) {
        currentItems.push({
          language: langMatch[1].trim(),
          proficiency: langMatch[3]?.trim() || 'Intermediate',
        });
      }
    }
  }

  // Don't forget the last section
  if (currentSection && currentBlock) {
    if (currentSection === 'experience' || currentSection === 'projects') {
      if (currentBullets.length > 0) {
        if (currentSection === 'experience') {
          currentItems.push({
            jobTitle: currentItems[currentItems.length - 1]?.jobTitle || '',
            companyName: currentItems[currentItems.length - 1]?.companyName || '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            bullets: currentBullets,
          });
        } else {
          currentItems.push({
            name: currentItems[currentItems.length - 1]?.name || '',
            description: currentItems[currentItems.length - 1]?.description || '',
            techStack: [],
            bullets: currentBullets,
          });
        }
      }
      currentBlock.data = currentItems;
    } else if (currentSection === 'skills') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'education') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'certifications') {
      currentBlock.data = currentItems;
    } else if (currentSection === 'languages') {
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
