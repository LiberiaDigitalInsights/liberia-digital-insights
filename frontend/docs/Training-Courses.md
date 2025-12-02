# Training Courses

## 🎓 Overview

The Training Courses system provides comprehensive functionality for creating, managing, and delivering educational content to help Liberian professionals develop their digital skills. It supports various course formats, progress tracking, and certification.

## ✨ Key Features

- **Course Creation**: Create and publish courses with rich content
- **Lesson Management**: Organize courses into lessons and modules
- **Video Integration**: Support for video lectures and demonstrations
- **Progress Tracking**: Monitor student progress and completion rates
- **Quizzes & Assessments**: Built-in testing and evaluation tools
- **Certification**: Generate certificates upon course completion
- **Enrollment Management**: Handle student enrollment and course access

## 🏗️ Architecture

### Frontend Components

```
src/components/training/
├── CourseCard.jsx          # Course preview component
├── CourseDetail.jsx        # Full course view
├── CourseForm.jsx          # Course creation/editing form
├── LessonPlayer.jsx        # Lesson content player
├── QuizComponent.jsx       # Quiz and assessment component
├── ProgressTracker.jsx     # Student progress tracking
├── CertificateViewer.jsx   # Certificate display
└── EnrollmentForm.jsx      # Course enrollment form
```

### Backend API

```
backend/src/routes/training.js  # Training CRUD operations
```

## 📝 Course Structure

```javascript
{
  id: "uuid",
  title: "Web Development Fundamentals",
  slug: "web-development-fundamentals",
  description: "Learn the basics of web development...",
  content: "Full course description and objectives...",
  instructor: {
    name: "John Doe",
    bio: "Senior Web Developer with 10+ years experience...",
    avatar: "https://example.com/instructor.jpg",
    credentials: ["BSc Computer Science", "AWS Certified"]
  },
  level: "beginner", // beginner, intermediate, advanced
  duration: "8 weeks",
  estimated_hours: 40,
  price: 99.99,
  currency: "USD",
  max_students: 50,
  current_students: 32,
  rating: 4.8,
  review_count: 156,
  status: "published", // draft, published, archived
  featured: false,
  tags: ["web development", "html", "css", "javascript"],
  prerequisites: [
    "Basic computer skills",
    "Internet access"
  ],
  learning_objectives: [
    "Understand HTML and CSS fundamentals",
    "Create responsive web layouts",
    "Add interactivity with JavaScript"
  ],
  lessons: [
    {
      id: "lesson-1",
      title: "Introduction to Web Development",
      description: "Overview of web technologies...",
      duration: "2 hours",
      type: "video", // video, text, quiz, assignment
      content_url: "https://example.com/video.mp4",
      order: 1
    }
  ],
  created_at: "2024-01-01T00:00:00Z",
  published_at: "2024-01-01T00:00:00Z"
}
```

## 🎯 Course Types

### Beginner Courses
- Introduction to programming concepts
- Basic web development skills
- Digital literacy fundamentals
- Computer basics and internet skills

### Intermediate Courses
- Advanced web development
- Mobile app development
- Database management
- Cloud computing basics

### Advanced Courses
- Machine learning fundamentals
- Advanced cloud architecture
- Cybersecurity principles
- DevOps and automation

### Workshops
- Short intensive training sessions
- Hands-on practical skills
- Industry-specific training
- Certification preparation

## 🔧 Course Management

### Course Creation Form

```jsx
// CourseForm.jsx
function CourseForm({ course, onSave, onCancel }) {
  const [formData, setFormData] = useState(course || {
    title: '',
    description: '',
    content: '',
    level: 'beginner',
    duration: '',
    estimated_hours: '',
    price: 0,
    currency: 'USD',
    max_students: 50,
    tags: [],
    prerequisites: [],
    learning_objectives: [],
    status: 'draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="e.g., 8 weeks"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estimated Hours
          </label>
          <input
            type="number"
            value={formData.estimated_hours}
            onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Students
          </label>
          <input
            type="number"
            value={formData.max_students}
            onChange={(e) => setFormData({...formData, max_students: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Learning Objectives
        </label>
        <div className="space-y-2">
          {formData.learning_objectives.map((objective, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...formData.learning_objectives];
                  newObjectives[index] = e.target.value;
                  setFormData({...formData, learning_objectives: newObjectives});
                }}
                className="flex-1 border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const newObjectives = formData.learning_objectives.filter((_, i) => i !== index);
                  setFormData({...formData, learning_objectives: newObjectives});
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({...formData, learning_objectives: [...formData.learning_objectives, '']})}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Add Objective
          </button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Save Course
        </button>
      </div>
    </form>
  );
}
```

## 📚 Lesson Management

### Lesson Player Component

```jsx
// LessonPlayer.jsx
function LessonPlayer({ lesson, onComplete, onNext, onPrevious }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(lesson.id);
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9">
            <video
              src={lesson.content_url}
              controls
              className="w-full h-full rounded-lg"
              onTimeUpdate={(e) => {
                const percent = (e.target.currentTime / e.target.duration) * 100;
                setProgress(percent);
              }}
              onEnded={handleComplete}
            />
          </div>
        );
      
      case 'text':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        );
      
      case 'quiz':
        return <QuizComponent quiz={lesson.quiz_data} onComplete={handleComplete} />;
      
      default:
        return <div>Lesson content not available</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-600">{lesson.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Duration: {lesson.duration}</span>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 rounded-full h-2 w-32">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        {renderLessonContent()}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Previous Lesson
        </button>
        
        <div className="flex space-x-2">
          {!isCompleted && lesson.type !== 'quiz' && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Mark as Complete
            </button>
          )}
          
          <button
            onClick={onNext}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 📊 Progress Tracking

### Progress Tracker Component

```jsx
// ProgressTracker.jsx
function ProgressTracker({ courseId, studentId }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseProgress(courseId, studentId).then(data => {
      setProgress(data);
      setLoading(false);
    });
  }, [courseId, studentId]);

  if (loading) return <LoadingSpinner />;
  
  const completionPercentage = (progress.completed_lessons / progress.total_lessons) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="bg-brand-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Completed Lessons</span>
          <span className="font-medium">{progress.completed_lessons} / {progress.total_lessons}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Time Spent</span>
          <span className="font-medium">{progress.time_spent} hours</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Quiz Average</span>
          <span className="font-medium">{progress.quiz_average}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Last Activity</span>
          <span className="font-medium">{formatDate(progress.last_activity)}</span>
        </div>
      </div>
      
      {progress.completed_lessons === progress.total_lessons && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-green-800 font-semibold mb-2">Course Completed!</h4>
          <p className="text-green-600 mb-4">Congratulations on completing this course.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            View Certificate
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🧩 Quiz System

### Quiz Component

```jsx
// QuizComponent.jsx
function QuizComponent({ quiz, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore);
  };

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === quiz.questions.length;

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Quiz Results</h3>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-brand-500 mb-2">{Math.round(score)}%</div>
          <p className="text-gray-600">
            You got {answers.filter((answer, index) => answer === quiz.questions[index].correct_answer).length} out of {quiz.questions.length} questions correct.
          </p>
        </div>
        
        <div className="space-y-3">
          {quiz.questions.map((question, index) => {
            const isCorrect = answers[question.id] === question.correct_answer;
            return (
              <div key={question.id} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-medium mb-2">{index + 1}. {question.question}</p>
                <p className="text-sm">
                  Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {answers[question.id] || 'Not answered'}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-green-600">
                    Correct answer: {question.correct_answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Quiz</h3>
          <span className="text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">{question.question}</h4>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => handleAnswer(question.id, option)}
                className="mr-3"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
```

## 📜 Certification

### Certificate Viewer

```jsx
// CertificateViewer.jsx
function CertificateViewer({ certificate }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="border-4 border-double border-brand-500 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Certificate of Completion</h2>
          <p className="text-lg mb-6">This is to certify that</p>
          <h3 className="text-2xl font-semibold mb-6">{certificate.student_name}</h3>
          <p className="text-lg mb-6">has successfully completed the course</p>
          <h4 className="text-xl font-semibold mb-6">{certificate.course_title}</h4>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-gray-600">Date Completed</p>
              <p className="font-medium">{formatDate(certificate.completion_date)}</p>
            </div>
            <div>
              <p className="text-gray-600">Final Score</p>
              <p className="font-medium">{certificate.final_score}%</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">{certificate.instructor_name}</p>
              <p className="text-sm text-gray-600">Instructor</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Liberia Digital Insights</p>
              <p className="text-sm text-gray-600">Director</p>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-xs text-gray-500 mb-2">Certificate ID: {certificate.id}</p>
            <p className="text-xs text-gray-500">Verification URL: {certificate.verification_url}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mt-6">
        <button className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
          Download PDF
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Share Certificate
        </button>
      </div>
    </div>
  );
}
```

## 🎨 Course Display

### Course Card Component

```jsx
// CourseCard.jsx
function CourseCard({ course }) {
  const isEnrolled = course.current_students < course.max_students;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm ${
              course.level === 'beginner' ? 'bg-green-100 text-green-800' :
              course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </div>
            
            {course.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Featured
              </span>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-brand-500">
              ${course.price}
            </div>
            <div className="text-sm text-gray-500">{course.duration}</div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          <Link to={`/course/${course.slug}`} className="hover:text-brand-500">
            {course.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {course.rating} ({course.review_count} reviews)
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            {course.estimated_hours} hours
          </div>
          
          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-2" />
            {course.current_students}/{course.max_students} students
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={isEnrolled ? "primary" : "outline"}
            className="flex-1"
            as={Link}
            to={`/course/${course.slug}`}
          >
            {isEnrolled ? 'Enroll Now' : 'View Course'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 🔧 API Integration

### Training Hooks

```javascript
// hooks/useTraining.js
export const useTraining = () => {
  return {
    // Get all courses
    getAllCourses: async (params = {}) => {
      const response = await apiRequest(`/v1/training/courses?${queryParams.toString()}`);
      return response;
    },

    // Get single course
    getCourseById: async (id) => {
      return await apiRequest(`/v1/training/courses/${id}`);
    },

    // Create course
    createCourse: async (courseData) => {
      return await apiRequest('/v1/training/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
    },

    // Update course
    updateCourse: async (id, courseData) => {
      return await apiRequest(`/v1/training/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });
    },

    // Delete course
    deleteCourse: async (id) => {
      await apiRequest(`/v1/training/courses/${id}`, {
        method: 'DELETE',
      });
    },

    // Enroll in course
    enrollInCourse: async (courseId, studentData) => {
      return await apiRequest(`/v1/training/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
    },

    // Get course progress
    getCourseProgress: async (courseId, studentId) => {
      return await apiRequest(`/v1/training/courses/${courseId}/progress/${studentId}`);
    },

    // Update lesson progress
    updateLessonProgress: async (courseId, lessonId, studentId, progress) => {
      return await apiRequest(`/v1/training/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ studentId, progress }),
      });
    },

    // Submit quiz
    submitQuiz: async (courseId, lessonId, studentId, answers) => {
      return await apiRequest(`/v1/training/courses/${courseId}/lessons/${lessonId}/quiz`, {
        method: 'POST',
        body: JSON.stringify({ studentId, answers }),
      });
    },

    // Generate certificate
    generateCertificate: async (courseId, studentId) => {
      return await apiRequest(`/v1/training/courses/${courseId}/certificate/${studentId}`);
    },
  };
};
```

## 📋 Best Practices

### Course Design

1. **Clear Learning Objectives**: Define specific, measurable learning outcomes
2. **Structured Content**: Organize content into logical modules and lessons
3. **Engaging Content**: Use videos, interactive elements, and practical exercises
4. **Regular Assessments**: Include quizzes and assignments to reinforce learning
5. **Progressive Difficulty**: Build complexity gradually throughout the course

### Student Engagement

1. **Interactive Elements**: Include quizzes, discussions, and hands-on projects
2. **Regular Feedback**: Provide timely feedback on assignments and quizzes
3. **Community Building**: Create forums and discussion boards
4. **Instructor Support**: Offer office hours and direct communication
5. **Motivation**: Use gamification and progress tracking

### Technical Standards

1. **Video Quality**: Use HD quality videos with clear audio
2. **Mobile Compatibility**: Ensure all content works on mobile devices
3. **Accessibility**: Provide captions and transcripts for videos
4. **Performance**: Optimize media files for fast loading
5. **Security**: Protect course content and student data

This Training Courses system provides comprehensive functionality for creating and delivering educational content to help develop Liberia's digital workforce.