
import { useState } from "react";
import "./App.css";

type Exam = {
  id: number;
  title: string;
  category: string;
  questions: number;
  duration: number;
  level: string;
  symbol: string;
};

type Result = {
  title: string;
  date: string;
  score: number;
};

const exams: Exam[] = [
  { id: 1, title: "Data Structures & Algorithms", category: "Computer Science", questions: 30, duration: 60, level: "Intermediate", symbol: "</>" },
  { id: 2, title: "Python Programming", category: "Computer Science", questions: 25, duration: 45, level: "Beginner", symbol: "Py" },
  { id: 3, title: "Database Management Systems", category: "Database", questions: 30, duration: 50, level: "Intermediate", symbol: "▤" },
  { id: 4, title: "Web Development", category: "Web Development", questions: 35, duration: 60, level: "Beginner", symbol: "◎" },
  { id: 5, title: "Logical Reasoning", category: "Aptitude", questions: 20, duration: 30, level: "Beginner", symbol: "✳" },
  { id: 6, title: "Operating Systems", category: "Computer Science", questions: 25, duration: 40, level: "Intermediate", symbol: "▣" },
  { id: 7, title: "Computer Networks", category: "Computer Science", questions: 25, duration: 45, level: "Intermediate", symbol: "⌘" },
  { id: 8, title: "Quantitative Aptitude", category: "Aptitude", questions: 30, duration: 45, level: "Intermediate", symbol: "∑" },
];

const upcomingExams = [
  { day: "18", month: "OCT", title: "Data Structures", time: "10:00 AM", duration: 60 },
  { day: "21", month: "OCT", title: "Database Management", time: "02:00 PM", duration: 50 },
  { day: "25", month: "OCT", title: "Web Development", time: "11:30 AM", duration: 60 },
];

const questions = [
  {
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    answer: 1,
  },
  {
    question: "Which SQL command retrieves data from a table?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: 2,
  },
  {
    question: "Which HTML element creates a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    answer: 1,
  },
  {
    question: "Which Python keyword defines a function?",
    options: ["function", "define", "func", "def"],
    answer: 3,
  },
  {
    question: "What is the average time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    answer: 2,
  },
];

const initialResults: Result[] = [
  { title: "Operating Systems", date: "12 Oct 2026", score: 88 },
  { title: "Computer Networks", date: "05 Oct 2026", score: 72 },
  { title: "Aptitude Test", date: "28 Sep 2026", score: 96 },
];

function App() {
  const [page, setPage] = useState("Home");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Result[]>(initialResults);
  const [score, setScore] = useState<number | null>(null);

  const filteredExams = exams.filter((exam) => {
    const matchesCategory = category === "All" || exam.category === category;
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase());
    const matchesBookmark = page !== "Bookmarks" || bookmarks.includes(exam.id);

    return matchesCategory && matchesSearch && matchesBookmark;
  });

  function navigate(nextPage: string) {
    setPage(nextPage);
    setMobileMenu(false);
    setCategory("All");
  }

  function toggleBookmark(id: number) {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function startExam(exam: Exam) {
    setActiveExam(exam);
    setQuestionIndex(0);
    setAnswers({});
    setScore(null);
  }

  function submitExam() {
    const correctAnswers = questions.filter(
      (question, index) => answers[index] === question.answer
    ).length;

    const finalScore = Math.round((correctAnswers / questions.length) * 100);

    setScore(finalScore);
    setResults((previous) => [
      {
        title: activeExam?.title ?? "Practice Exam",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        score: finalScore,
      },
      ...previous,
    ]);
  }

  function exitExam() {
    setActiveExam(null);
    setScore(null);
    setPage("Home");
  }

  function openExamById(id: number) {
    const exam = exams.find((item) => item.id === id);
    if (exam) startExam(exam);
  }

  if (activeExam) {
    const question = questions[questionIndex];

    return (
      <div className="quiz-page">
        <header className="quiz-header">
          <div className="brand">
            <span className="brand-mark">◆</span>
            <div>
              <strong>EXAMORA</strong>
              <small>ONLINE EXAM PORTAL</small>
            </div>
          </div>
          <button className="button button-outline" onClick={exitExam}>
            Exit Exam
          </button>
        </header>

        <main className="quiz-main">
          {score === null ? (
            <>
              <div className="quiz-title-row">
                <div>
                  <p className="eyebrow">ONLINE ASSESSMENT</p>
                  <h1>{activeExam.title}</h1>
                  <p className="muted">Practice quiz · {questions.length} sample questions</p>
                </div>
                <div className="timer">◷ &nbsp; Untimed</div>
              </div>

              <div className="progress-track">
                <div
                  style={{
                    width: `${((questionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <section className="panel question-panel">
                <div className="question-meta">
                  <span>QUESTION {questionIndex + 1} OF {questions.length}</span>
                  <span>Choose one answer</span>
                </div>

                <h2>{question.question}</h2>

                <div className="answer-options">
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      className={`answer-option ${
                        answers[questionIndex] === index ? "selected" : ""
                      }`}
                      onClick={() =>
                        setAnswers((previous) => ({
                          ...previous,
                          [questionIndex]: index,
                        }))
                      }
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {answers[questionIndex] === index && (
                        <span className="gold-icon">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="quiz-controls">
                  <button
                    className="button button-outline"
                    disabled={questionIndex === 0}
                    onClick={() => setQuestionIndex((previous) => previous - 1)}
                  >
                    Previous
                  </button>

                  {questionIndex < questions.length - 1 ? (
                    <button
                      className="button button-gold"
                      onClick={() => setQuestionIndex((previous) => previous + 1)}
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button className="button button-gold" onClick={submitExam}>
                      Submit Exam
                    </button>
                  )}
                </div>
              </section>

              <section className="panel question-numbers">
                <strong>Question Navigator</strong>
                <div className="number-list">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      className={`${questionIndex === index ? "current" : ""} ${
                        answers[index] !== undefined ? "answered" : ""
                      }`}
                      onClick={() => setQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <p className="muted">
                  Answered: {Object.keys(answers).length} / {questions.length}
                </p>
              </section>
            </>
          ) : (
            <section className="panel quiz-result">
              <div className="result-trophy">★</div>
              <p className="eyebrow">ASSESSMENT COMPLETED</p>
              <h1>Your Result</h1>
              <div className="score-circle">{score}%</div>
              <p className="muted">
                You answered{" "}
                {questions.filter((q, i) => answers[i] === q.answer).length} out of{" "}
                {questions.length} questions correctly.
              </p>
              <button className="button button-gold" onClick={exitExam}>
                Back to Dashboard →
              </button>
            </section>
          )}
        </main>
      </div>
    );
  }

  const navItems = [
    { label: "Home", symbol: "⌂" },
    { label: "Explore Exams", symbol: "▤" },
    { label: "My Exams", symbol: "▦" },
    { label: "Results", symbol: "▥" },
    { label: "Bookmarks", symbol: "☆" },
  ];

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">◆</span>
          <div>
            <strong>EXAMORA</strong>
            <small>Online Exam Portal</small>
          </div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            ×
          </button>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => navigate(item.label)}
            >
              <span className="nav-symbol">{item.symbol}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => window.alert("Settings coming soon.")}>
            <span className="nav-symbol">⚙</span>
            <span>Settings</span>
          </button>
          <button className="nav-item" onClick={() => window.alert("Contact your portal administrator for help.")}>
            <span className="nav-symbol">?</span>
            <span>Help & Support</span>
          </button>
          <div className="upgrade-card">
            <span className="gold-icon">★</span>
            <div>
              <strong>Keep improving</strong>
              <p>Practice makes progress.</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <label className="search-box">
            <span className="search-symbol">⌕</span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                if (page === "Home") setPage("Explore Exams");
              }}
              placeholder="Search exams, subjects or topics..."
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                ×
              </button>
            )}
          </label>

          <button
            className="notification-button"
            onClick={() => window.alert("You are all caught up!")}
            aria-label="Notifications"
          >
            ♧<span />
          </button>

          <button
            className="profile-button"
            onClick={() => window.alert("Student profile")}
          >
            <span className="avatar">S</span>
            <span className="profile-label">Student</span>
            <span>⌄</span>
          </button>
        </header>

        <div className="content-area">
          {page === "Home" ? (
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">WELCOME BACK</p>
                <h1>
                  Keep Learning,
                  <br />
                  <span>Keep Growing</span>
                </h1>
                <p>
                  Take exams, track your progress and build
                  <br className="desktop-only" /> a brighter future.
                </p>
                <button
                  className="button button-gold"
                  onClick={() => navigate("Explore Exams")}
                >
                  Explore Exams <span>→</span>
                </button>
              </div>
              <div className="hero-decoration" aria-hidden="true">
                <span>◆</span>
                <span>EXAMORA</span>
              </div>
            </section>
          ) : (
            <section className="page-heading">
              <p className="eyebrow">YOUR LEARNING SPACE</p>
              <h1>
                {page === "Bookmarks" ? "Saved Exams" : page}
              </h1>
              <p className="muted">
                Discover exams, practice and review your progress.
              </p>
            </section>
          )}

          <div className="dashboard-grid">
            <section className="exam-section">
              <div className="section-heading">
                <h2>
                  {page === "Bookmarks"
                    ? "Your Bookmarks"
                    : page === "Results"
                    ? "Your Results"
                    : page === "My Exams"
                    ? "Upcoming Exams"
                    : page === "Home"
                    ? "Explore Exams"
                    : "Available Exams"}
                </h2>
                <button
                  className="text-link"
                  onClick={() => navigate("Explore Exams")}
                >
                  View All →
                </button>
              </div>

              {page === "Results" ? (
                <div className="panel results-panel">
                  {results.map((result, index) => (
                    <div className="result-row" key={`${result.title}-${index}`}>
                      <div className="result-icon">▣</div>
                      <div className="result-info">
                        <strong>{result.title}</strong>
                        <span>{result.date}</span>
                      </div>
                      <strong className="result-score">{result.score}%</strong>
                      <span className={`status ${result.score < 80 ? "status-review" : ""}`}>
                        {result.score >= 80 ? "Passed" : "Review"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : page === "My Exams" ? (
                <div className="panel upcoming-list">
                  {upcomingExams.map((item) => (
                    <div className="upcoming-item" key={item.title}>
                      <div className="date-tile">
                        <span>{item.month}</span>
                        <strong>{item.day}</strong>
                      </div>
                      <div className="upcoming-info">
                        <strong>{item.title}</strong>
                        <span>
                          {item.time} · {item.duration} Minutes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="category-list">
                    {[
                      "All",
                      "Computer Science",
                      "Aptitude",
                      "Web Development",
                      "Database",
                    ].map((item) => (
                      <button
                        key={item}
                        className={`category-chip ${category === item ? "selected" : ""}`}
                        onClick={() => setCategory(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {filteredExams.length > 0 ? (
                    <div className="exam-grid">
                      {filteredExams.map((exam) => (
                        <article className="exam-card" key={exam.id}>
                          <div className="exam-card-top">
                            <div className="exam-icon">{exam.symbol}</div>
                            {exam.id === 1 && (
                              <span className="popular-tag">Popular</span>
                            )}
                          </div>

                          <h3>{exam.title}</h3>
                          <p className="exam-description">
                            {exam.category} assessment with practice questions and instant results.
                          </p>

                          <div className="exam-details">
                            <span><b>▤</b>{exam.questions} Questions</span>
                            <span><b>◷</b>{exam.duration} Minutes</span>
                            <span><b>♙</b>{exam.level}</span>
                          </div>

                          <div className="exam-actions">
                            <button
                              className="button button-gold start-button"
                              onClick={() => startExam(exam)}
                            >
                              Start Exam →
                            </button>
                            <button
                              className={`bookmark-button ${bookmarks.includes(exam.id) ? "bookmarked" : ""}`}
                              onClick={() => toggleBookmark(exam.id)}
                              aria-label="Toggle bookmark"
                            >
                              {bookmarks.includes(exam.id) ? "★" : "☆"}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state panel">
                      <h3>No exams found</h3>
                      <p>Try another search or category.</p>
                      <button
                        className="button button-outline"
                        onClick={() => {
                          setSearch("");
                          setCategory("All");
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>

            <aside className="right-column">
              <section className="panel upcoming-panel">
                <div className="section-heading">
                  <h2>Upcoming Exams</h2>
                  <button className="text-link" onClick={() => navigate("My Exams")}>
                    View All →
                  </button>
                </div>

                <div className="upcoming-list">
                  {upcomingExams.map((item) => (
                    <div className="upcoming-item" key={item.title}>
                      <div className="date-tile">
                        <span>{item.month}</span>
                        <strong>{item.day}</strong>
                      </div>
                      <div className="upcoming-info">
                        <strong>{item.title}</strong>
                        <span>{item.time} · {item.duration} Minutes</span>
                      </div>
                      <span className="muted">›</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel progress-panel">
                <div className="section-heading">
                  <h2>Your Progress</h2>
                  <span className="gold-icon">▥</span>
                </div>
                <div className="progress-stat">
                  <span>Average score</span>
                  <strong>
                    {results.length
                      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
                      : 0}%
                  </strong>
                </div>
                <div className="progress-track">
                  <div
                    style={{
                      width: `${
                        results.length
                          ? results.reduce((sum, result) => sum + result.score, 0) / results.length
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="progress-stat">
                  <span>Completed attempts</span>
                  <strong>{results.length}</strong>
                </div>
                <p className="muted small-text">
                  Keep practicing to build confidence and improve your results.
                </p>
              </section>
            </aside>
          </div>

          <div className="bottom-grid">
            <section className="panel results-panel">
              <div className="section-heading">
                <h2>Recent Results</h2>
                <button className="text-link" onClick={() => navigate("Results")}>
                  View All →
                </button>
              </div>

              {results.slice(0, 3).map((result, index) => (
                <div className="result-row" key={`${result.title}-${index}`}>
                  <div className="result-icon">▣</div>
                  <div className="result-info">
                    <strong>{result.title}</strong>
                    <span>{result.date}</span>
                  </div>
                  <strong className="result-score">{result.score}%</strong>
                  <span className={`status ${result.score < 80 ? "status-review" : ""}`}>
                    {result.score >= 80 ? "Passed" : "Review"}
                  </span>
                </div>
              ))}
            </section>

            <section className="panel recommended-panel">
              <div className="section-heading">
                <h2>Recommended for You</h2>
                <button
                  className="text-link"
                  onClick={() => navigate("Explore Exams")}
                >
                  View All →
                </button>
              </div>

              {[
                { title: "Logical Reasoning", detail: "20 Questions · 30 Minutes", id: 5 },
                { title: "Operating Systems", detail: "25 Questions · 40 Minutes", id: 6 },
                { title: "Computer Networks", detail: "25 Questions · 45 Minutes", id: 7 },
              ].map((item) => (
                <div className="recommend-row" key={item.title}>
                  <div className="recommend-icon">✳</div>
                  <div className="recommend-info">
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <button
                    className="button button-gold mini-button"
                    onClick={() => openExamById(item.id)}
                  >
                    Start
                  </button>
                </div>
              ))}
            </section>
          </div>

          <footer className="footer">
            <span>© 2026 EXAMORA</span>
            <span>Learn. Practice. Progress.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;


