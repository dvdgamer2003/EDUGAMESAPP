import class6ComputerContent from '../data/class6-computer-content.json';
import class6EnglishContent from '../data/class6-english-content.json';
import class6ScienceContent from '../data/class6-science-content.json';
import class6MathsContent from '../data/class6-maths-content.json';

// Offline data store - all educational content available locally
const offlineData = {
    class6: {
        computer: class6ComputerContent,
        english: class6EnglishContent,
        science: class6ScienceContent,
        maths: class6MathsContent,
    }
};

/**
 * Offline Data Service
 * Provides educational content from local JSON files when offline
 */
export const offlineDataService = {
    /**
     * Get all classes available offline
     */
    getClasses: () => {
        return [
            {
                _id: '691eafac8eb433fec69cf13a',
                classNumber: 6,
                name: 'Class 6',
                description: 'Grade 6 curriculum'
            }
        ];
    },

    /**
     * Get subjects for a specific class
     */
    getSubjects: (classId: string) => {
        // For now, we only have Class 6 data
        if (classId === '691eafac8eb433fec69cf13a') {
            return [
                {
                    _id: '691eafac8eb433fec69cf13c',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: '69233db098c793077f0ecd01',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: '69233db3fe3cabf71c0237a1',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                },
                {
                    _id: '691eafac8eb433fec69cf242',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                }
            ];
        }
        return [];
    },

    /**
     * Get chapters for a specific subject
     */
    getChapters: (subjectId: string) => {
        let content: any = null;

        // Map subject ID to content
        if (subjectId === '691eafac8eb433fec69cf13c') {
            content = offlineData.class6.science;
        } else if (subjectId === '69233db098c793077f0ecd01') {
            content = offlineData.class6.english;
        } else if (subjectId === '69233db3fe3cabf71c0237a1') {
            content = offlineData.class6.computer;
        } else if (subjectId === '691eafac8eb433fec69cf242') {
            content = offlineData.class6.maths;
        } else {
            // Subject not available offline
            console.log(`Subject ${subjectId} not available offline`);
            return [];
        }

        if (!content || !content.chapters) {
            return [];
        }

        const chapters = content.chapters.map((chapter: any, index: number) => ({
            _id: `chapter-${subjectId}-${index}`,
            name: chapter.name, // Changed from title to name to match UI expectations
            description: chapter.description || '',
            subjectId: subjectId,
            order: index + 1,
            subchapters: chapter.subchapters || []
        }));

        console.log(`[OFFLINE] Returning ${chapters.length} chapters for subject ${subjectId}`);
        if (chapters.length > 0) {
            console.log('[OFFLINE] First chapter:', chapters[0]);
        }

        return chapters;
    },

    /**
     * Get lessons/subchapters for a specific chapter
     */
    getLessons: (chapterId: string) => {
        // Extract subject and chapter index from chapterId
        const parts = chapterId.split('-');
        if (parts.length < 4) return [];

        const subjectId = `${parts[1]}-${parts[2]}-${parts[3]}`;
        const chapterIndex = parseInt(parts[parts.length - 1]);

        const chapters = offlineDataService.getChapters(subjectId);
        if (chapterIndex >= 0 && chapterIndex < chapters.length) {
            const subchapters = chapters[chapterIndex].subchapters;
            return subchapters.map((subchapter: any, index: number) => ({
                _id: `lesson-${chapterId}-${index}`,
                title: subchapter.name,
                content: subchapter.content,
                quiz: subchapter.quiz,
                chapterId: chapterId,
                order: index + 1
            }));
        }

        return [];
    },

    /**
     * Get chapter content for reading mode
     */
    getChapterContent: (chapterId: string) => {
        const lessons = offlineDataService.getLessons(chapterId);

        // Combine content from all lessons
        const combinedContent = lessons.map((lesson: any) => {
            const content = lesson.content;
            return `
# ${lesson.title}

${content.explanation || ''}

### Key Points
${(content.keyPoints || []).map((point: string) => `- ${point}`).join('\n')}
            `;
        }).join('\n\n---\n\n');

        return {
            combinedContent
        };
    },

    /**
     * Get a specific lesson by ID
     */
    getLesson: (lessonId: string) => {
        // Extract chapter ID from lesson ID
        const parts = lessonId.split('-');
        if (parts.length < 6) return null;

        const chapterId = parts.slice(0, 5).join('-');
        const lessonIndex = parseInt(parts[5]);

        const lessons = offlineDataService.getLessons(chapterId);
        return lessons[lessonIndex] || null;
    },

    /**
     * Check if content is available offline for a class
     */
    isClassAvailable: (classNumber: number) => {
        return classNumber === 6; // Only Class 6 is available offline currently
    }
};

export default offlineDataService;
