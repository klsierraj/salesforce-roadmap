<script setup>
import { ref, computed, onMounted } from 'vue';
import { blocksPart1 } from './data/courseData.js';
import { blocksPart2 } from './data/advancedCourseData.js';
import {
  masterInterviewBank,
  codeTranslatorSnippets,
  architectPyramidStages,
  masterGlossary
} from './data/interviewBankData.js';

const STORAGE_KEY = 'aprende_salesforce_progress_v2';
const EXAM_STORAGE_KEY = 'aprende_salesforce_exams_v2';
const MASTERED_Q_KEY = 'aprende_salesforce_mastered_q_v2';
const CERTS_KEY = 'aprende_salesforce_certs_v2';

const blocks = ref([...blocksPart1, ...blocksPart2]);
const questions = ref(masterInterviewBank);
const translatorItems = ref(codeTranslatorSnippets);
const pyramidStages = ref(architectPyramidStages);
const glossaryItems = ref(masterGlossary);

const searchQuery = ref('');
const interviewCategory = ref('All');
const interviewSearch = ref('');
const glossaryCategory = ref('All');
const glossarySearch = ref('');
const currentView = ref('home'); // 'home' | 'lesson' | 'exam' | 'interview' | 'translator' | 'career' | 'glossary'
const activeLessonId = ref('0-1');
const activeExamBlockId = ref('block-0');
const isSidebarOpen = ref(false);
const mainViewportRef = ref(null);

const completedSteps = ref({});
const completedExams = ref({});
const masteredQuestions = ref({});
const completedCerts = ref({});
const quizSelections = ref({});
const revealedFlashcards = ref({});
const copiedCode = ref(false);

const monthlyLivingCostUsd = ref(2500);
const annualReturnPct = ref(9);

onMounted(() => {
  try {
    const s1 = localStorage.getItem(STORAGE_KEY);
    if (s1) completedSteps.value = JSON.parse(s1);
    const s2 = localStorage.getItem(EXAM_STORAGE_KEY);
    if (s2) completedExams.value = JSON.parse(s2);
    const s3 = localStorage.getItem(MASTERED_Q_KEY);
    if (s3) masteredQuestions.value = JSON.parse(s3);
    const s4 = localStorage.getItem(CERTS_KEY);
    if (s4) completedCerts.value = JSON.parse(s4);
  } catch (e) {
    console.error(e);
  }
});

const saveProgress = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSteps.value));
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(completedExams.value));
    localStorage.setItem(MASTERED_Q_KEY, JSON.stringify(masteredQuestions.value));
    localStorage.setItem(CERTS_KEY, JSON.stringify(completedCerts.value));
  } catch (e) {
    console.error(e);
  }
};

const toggleStep = (stepId) => {
  completedSteps.value[stepId] = !completedSteps.value[stepId];
  saveProgress();
};

const isStepDone = (stepId) => !!completedSteps.value[stepId];

const toggleMasteredQuestion = (qId) => {
  masteredQuestions.value[qId] = !masteredQuestions.value[qId];
  saveProgress();
};

const toggleCert = (certName) => {
  completedCerts.value[certName] = !completedCerts.value[certName];
  saveProgress();
};

const getLessonProgress = (lesson) => {
  const total = lesson.steps ? lesson.steps.length : 0;
  if (total === 0) return { done: 0, total: 0, isComplete: false };
  const done = lesson.steps.filter((s) => completedSteps.value[s.id]).length;
  return { done, total, isComplete: done === total };
};

const getBlockProgress = (block) => {
  const totalLessons = block.lessons.length;
  const doneLessons = block.lessons.filter((l) => getLessonProgress(l).isComplete).length;
  const filledDots = '■'.repeat(doneLessons);
  const emptyDots = '.'.repeat(Math.max(0, totalLessons - doneLessons));
  return {
    done: doneLessons,
    total: totalLessons,
    filledDots,
    emptyDots
  };
};

const totalCourseStats = computed(() => {
  let totalSteps = 0;
  let doneSteps = 0;
  let totalLessons = 0;
  blocks.value.forEach((b) => {
    totalLessons += b.lessons.length;
    b.lessons.forEach((l) => {
      totalSteps += l.steps.length;
      l.steps.forEach((s) => {
        if (completedSteps.value[s.id]) doneSteps++;
      });
    });
  });
  const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
  const masteredCount = questions.value.filter((q) => masteredQuestions.value[q.id]).length;
  return {
    totalSteps,
    doneSteps,
    totalLessons,
    pct,
    masteredCount,
    totalQuestions: questions.value.length,
    totalGlossary: glossaryItems.value.length
  };
});

const filteredBlocks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return blocks.value;
  return blocks.value
    .map((b) => ({
      ...b,
      lessons: b.lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.concepts.some(
            (c) => c.title.toLowerCase().includes(q) || c.body.toLowerCase().includes(q)
          )
      )
    }))
    .filter((b) => b.lessons.length > 0);
});

const interviewCategories = computed(() => {
  const set = new Set(['All']);
  questions.value.forEach((q) => set.add(q.category));
  return Array.from(set);
});

const filteredInterviewQuestions = computed(() => {
  return questions.value.filter((item) => {
    const matchCat =
      interviewCategory.value === 'All' || item.category === interviewCategory.value;
    const q = interviewSearch.value.trim().toLowerCase();
    const matchText =
      !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    return matchCat && matchText;
  });
});

const glossaryCategories = computed(() => {
  const set = new Set(['All']);
  glossaryItems.value.forEach((g) => set.add(g.category));
  return Array.from(set);
});

const filteredGlossaryItems = computed(() => {
  return glossaryItems.value.filter((item) => {
    const matchCat =
      glossaryCategory.value === 'All' || item.category === glossaryCategory.value;
    const q = glossarySearch.value.trim().toLowerCase();
    const matchText =
      !q ||
      item.term.toLowerCase().includes(q) ||
      item.devEquivalent.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q);
    return matchCat && matchText;
  });
});

const allLessonsFlat = computed(() => {
  const list = [];
  blocks.value.forEach((b) => {
    b.lessons.forEach((l) => {
      list.push({ block: b, lesson: l });
    });
  });
  return list;
});

const currentLessonContext = computed(() => {
  return (
    allLessonsFlat.value.find((item) => item.lesson.id === activeLessonId.value) ||
    allLessonsFlat.value[0]
  );
});

const adjacentLessons = computed(() => {
  const idx = allLessonsFlat.value.findIndex((i) => i.lesson.id === activeLessonId.value);
  return {
    prev: idx > 0 ? allLessonsFlat.value[idx - 1] : null,
    next: idx >= 0 && idx < allLessonsFlat.value.length - 1 ? allLessonsFlat.value[idx + 1] : null
  };
});

const activeExamBlock = computed(() => {
  return blocks.value.find((b) => b.id === activeExamBlockId.value) || blocks.value[0];
});

const wealthProjectionRows = computed(() => {
  const incomesMonthly = [4500, 7000, 10000, 12000, 14000, 16000, 17000, 18000];
  const roles = [
    'Salesforce Dev / Integration (Year 1)',
    'Senior Dev + Integration Architect (Year 2)',
    'Application + Integration Architect US (Year 3)',
    'Senior B2B Integration Architect (Year 4)',
    'Principal Architect Contractor (Year 5)',
    'Principal Architect + Fractional (Year 6)',
    'Enterprise B2B Architect (Year 7)',
    'Financial Independence / Coast FIRE (Year 8)'
  ];
  let netWorth = 0;
  const r = Number(annualReturnPct.value) / 100;
  const annualCost = Number(monthlyLivingCostUsd.value) * 12;

  return incomesMonthly.map((monthlyGross, idx) => {
    const netAnnualIncome = Math.round(monthlyGross * 12 * 0.86);
    const annualSavings = Math.max(0, netAnnualIncome - annualCost);
    netWorth = Math.round(netWorth * (1 + r) + annualSavings);
    const copMillions = Math.round((netWorth * 4200) / 1000000);
    return {
      age: `Age ${27 + idx} → ${28 + idx}`,
      role: roles[idx],
      monthlyGross: `$${monthlyGross.toLocaleString()} USD`,
      annualSavings: `+$${annualSavings.toLocaleString()} USD`,
      netWorthUsd: `$${netWorth.toLocaleString()} USD`,
      netWorthCop: `~$${copMillions.toLocaleString()}M COP`
    };
  });
});

const scrollTop = () => {
  mainViewportRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
};

const openHome = () => {
  currentView.value = 'home';
  isSidebarOpen.value = false;
  scrollTop();
};

const openLesson = (lessonId) => {
  activeLessonId.value = lessonId;
  currentView.value = 'lesson';
  isSidebarOpen.value = false;
  scrollTop();
};

const openExam = (blockId) => {
  activeExamBlockId.value = blockId;
  currentView.value = 'exam';
  isSidebarOpen.value = false;
  scrollTop();
};

const openInterviewSimulator = () => {
  currentView.value = 'interview';
  isSidebarOpen.value = false;
  scrollTop();
};

const openTranslator = () => {
  currentView.value = 'translator';
  isSidebarOpen.value = false;
  scrollTop();
};

const openCareer = () => {
  currentView.value = 'career';
  isSidebarOpen.value = false;
  scrollTop();
};

const openGlossary = () => {
  currentView.value = 'glossary';
  isSidebarOpen.value = false;
  scrollTop();
};

const selectQuizOption = (examId, qIdx, optIdx) => {
  const key = `${examId}-${qIdx}`;
  quizSelections.value[key] = optIdx;
  const exam = activeExamBlock.value.exam;
  const allCorrect = exam.questions.every((q, idx) => {
    return quizSelections.value[`${exam.id}-${idx}`] === q.correct;
  });
  if (allCorrect) {
    completedExams.value[exam.id] = true;
    saveProgress();
  }
};

const toggleFlashcard = (id) => {
  revealedFlashcards.value[id] = !revealedFlashcards.value[id];
};

const revealAllFlashcards = () => {
  const anyHidden = filteredInterviewQuestions.value.some((q) => !revealedFlashcards.value[q.id]);
  filteredInterviewQuestions.value.forEach((q) => {
    revealedFlashcards.value[q.id] = anyHidden;
  });
};

const copySnippet = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    copiedCode.value = true;
    setTimeout(() => {
      copiedCode.value = false;
    }, 1800);
  } catch (e) {
    console.error(e);
  }
};

const resetAllProgress = () => {
  if (confirm('Do you want to reset all local progress back to 0?')) {
    completedSteps.value = {};
    completedExams.value = {};
    masteredQuestions.value = {};
    completedCerts.value = {};
    quizSelections.value = {};
    saveProgress();
  }
};

const scrollToSyllabus = () => {
  document.getElementById('syllabus-section')?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <div class="app-layout">
    <!-- Mobile Sidebar Backdrop -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-backdrop"
      @click="isSidebarOpen = false"
    ></div>

    <!-- ========================
         LEFT SIDEBAR
         ======================== -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }">
      <div class="brand-bar">
        <div class="brand-logo" @click="openHome">
          <div class="brand-icon">☁️</div>
          <div class="brand-text">Learn <span>Salesforce</span></div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button
            class="icon-btn"
            title="Reset local progress"
            @click="resetAllProgress"
          >
            ↺
          </button>
          <button
            class="icon-btn mobile-close-btn"
            title="Close menu"
            @click="isSidebarOpen = false"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Terminal Warning Box -->
      <div class="terminal-notice">
        <div class="warn-line">
          warning: local progress ({{ totalCourseStats.pct }}%)
        </div>
        <div class="help-line">
          = help: {{ totalCourseStats.doneSteps }}/{{ totalCourseStats.totalSteps }} labs ·
          {{ totalCourseStats.masteredCount }}/{{ totalCourseStats.totalQuestions }} Q&amp;A mastered.
          <strong @click="openGlossary">Open Glossary A–Z</strong>
        </div>
      </div>

      <!-- Search Input -->
      <div class="search-box">
        <span class="prompt-char">&gt;</span>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="search lesson or concept..."
        />
      </div>

      <!-- 7 Blocks (Block 00 to Block 06) -->
      <div
        v-for="block in filteredBlocks"
        :key="block.id"
        class="block-section"
      >
        <div class="block-header">
          <div class="block-header-left">
            <span class="block-num">{{ block.num }}</span>
            <span class="block-title" :title="block.title">{{ block.title }}</span>
          </div>
          <div class="block-ascii-progress">
            [<span class="filled">{{ getBlockProgress(block).filledDots }}</span>{{ getBlockProgress(block).emptyDots }}]
            {{ getBlockProgress(block).done }}/{{ getBlockProgress(block).total }}
          </div>
        </div>

        <ul class="lesson-list">
          <li
            v-for="lesson in block.lessons"
            :key="lesson.id"
            class="lesson-item"
            :class="{
              active: currentView === 'lesson' && activeLessonId === lesson.id,
              done: getLessonProgress(lesson).isComplete
            }"
            @click="openLesson(lesson.id)"
          >
            <div class="lesson-item-left">
              <span class="lesson-bullet">
                {{ getLessonProgress(lesson).isComplete ? '●' : '○' }}
              </span>
              <span class="lesson-name">
                {{ lesson.id }} · {{ lesson.title }}
              </span>
            </div>
            <span class="lesson-counter">
              {{ getLessonProgress(lesson).done }}/{{ getLessonProgress(lesson).total }}
            </span>
          </li>

          <!-- Block Exam Item -->
          <li
            v-if="block.exam"
            class="lesson-item"
            :class="{
              active: currentView === 'exam' && activeExamBlockId === block.id,
              done: completedExams[block.exam.id]
            }"
            @click="openExam(block.id)"
          >
            <div class="lesson-item-left">
              <span class="lesson-bullet">
                {{ completedExams[block.exam.id] ? '✓' : '▣' }}
              </span>
              <span class="lesson-name">
                <span class="exam-badge">exam</span>{{ block.exam.title.replace('Block ', 'B') }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <!-- ========================
         MAIN VIEWPORT
         ======================== -->
    <main ref="mainViewportRef" class="main-viewport">
      <!-- Sticky Top Navigation Bar -->
      <header class="top-nav">
        <div class="top-nav-tabs">
          <button
            class="mobile-menu-btn"
            @click="isSidebarOpen = true"
          >
            ☰ Syllabus
          </button>
          <button
            class="nav-tab-btn"
            :class="{ active: currentView === 'home' }"
            @click="openHome"
          >
            🏠 Home
          </button>
          <button
            class="nav-tab-btn"
            :class="{ active: currentView === 'lesson' || currentView === 'exam' }"
            @click="openLesson(activeLessonId)"
          >
            📚 Lesson ({{ activeLessonId }})
          </button>
          <button
            class="nav-tab-btn"
            :class="{ active: currentView === 'glossary' }"
            @click="openGlossary"
          >
            📖 Glossary ({{ totalCourseStats.totalGlossary }})
          </button>
          <button
            class="nav-tab-btn"
            :class="{ active: currentView === 'interview' }"
            @click="openInterviewSimulator"
          >
            🎯 Interview Bank ({{ totalCourseStats.masteredCount }}/{{ totalCourseStats.totalQuestions }})
          </button>
          <button
            class="nav-tab-btn"
            :class="{ active: currentView === 'translator' }"
            @click="openTranslator"
          >
            🔄 TS/SQL → Apex/LWC
          </button>
          <button
            class="nav-tab-btn"
            :class="{ active: currentView === 'career' }"
            @click="openCareer"
          >
            🏆 Architect &amp; Wealth (27→35)
          </button>
        </div>
        <div class="stat-pill top-nav-target-pill" style="border-color: var(--accent-border); color: var(--accent);">
          Target: Application &amp; Integration Architect
        </div>
      </header>

      <!-- Decorative Background Grid Symbols -->
      <div class="bg-deco" style="top: 118px; left: 18%;">SOQL</div>
      <div class="bg-deco" style="top: 340px; left: 8%;">&gt;_</div>
      <div class="bg-deco" style="top: 140px; right: 14%;">@wire</div>
      <div class="bg-deco" style="top: 520px; left: 44%;">{ __c }</div>

      <!-- ========================
           1. HOME / HERO VIEW
           ======================== -->
      <section v-if="currentView === 'home'" class="hero-container">
        <div class="hero-split">
          <div>
            <h1 class="hero-title">
              Learn <span class="highlight">Salesforce</span><br />
              from scratch
            </h1>

            <p class="hero-subtitle">
              Start at <strong>Block 00 (What is a CRM &amp; Ecosystem Map)</strong>, master
              <strong>Salesforce Developer + RevOps in 90 days</strong>, and scale to
              <strong>B2B Application &amp; Integration Architect (15–18 months)</strong>.
            </p>

            <div class="pill-row">
              <span class="stat-pill">Blocks 00 to 06</span>
              <span class="stat-pill">{{ totalCourseStats.totalLessons }} Deep Lessons</span>
              <span class="stat-pill">{{ totalCourseStats.totalGlossary }} Glossary Terms</span>
              <span class="stat-pill">Exams + Senior Interview Bank</span>
            </div>

            <div class="cta-row">
              <button class="btn-primary" @click="openLesson('0-1')">
                Start Block 00 (What is Salesforce?) →
              </button>
              <button class="btn-secondary" @click="openGlossary">
                📖 Master Glossary (A–Z)
              </button>
              <button class="btn-secondary" @click="openInterviewSimulator">
                🎯 Interview Simulator
              </button>
            </div>

            <span class="jump-link" @click="scrollToSyllabus">
              Explore the full 7-block curriculum (Block 00 → Block 06) ↓
            </span>
          </div>

          <!-- Right Column: Code & Terminal Window -->
          <div class="code-showcase">
            <div class="code-window-bar">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="code-filename">force-app/main/default/classes/AccountTriggerHandler.cls</span>
            </div>
            <div class="code-window-body">
              <div><span class="tok-kw">public with sharing class</span> <span class="tok-type">AccountTriggerHandler</span> {</div>
              <div>&nbsp;&nbsp;<span class="tok-kw">public static void</span> <span class="tok-fn">afterUpdate</span>(<span class="tok-type">List&lt;Account&gt;</span> newAccs) {</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-type">String</span> target = <span class="tok-str">'B2B Integration Architect'</span>;</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-type">System</span>.<span class="tok-fn">debug</span>(<span class="tok-str">'Next stop: '</span> + target);</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="tok-type">System</span>.<span class="tok-fn">enqueueJob</span>(<span class="tok-kw">new</span> <span class="tok-type">TenantProvisioningQueueable</span>(newAccs));</div>
              <div>&nbsp;&nbsp;}</div>
              <div>}</div>
            </div>
            <div class="code-terminal-divider">
              <div style="color: #a1a1aa;">$ sf project deploy start -o sfdc-dev</div>
              <div><span class="tok-type">Deploying</span> v62.0 metadata to Developer Edition Org...</div>
              <div><span class="tok-ok">Succeeded</span> in 1.42s — Status: <span class="tok-ok">Deployed (100% Coverage)</span></div>
              <div style="color: var(--accent); font-weight: 700; margin-top: 4px;">
                All-in on Salesforce Architecture █
              </div>
            </div>
          </div>
        </div>

        <!-- Syllabus Overview Section -->
        <div id="syllabus-section" class="how-it-works">
          <div class="eyebrow">COMPLETE ENGINEERING TRACK</div>
          <h2 class="section-heading">
            Blocks 00 to 06: From CRM Basics to Application &amp; Integration Architect
          </h2>

          <div class="blocks-grid">
            <div
              v-for="block in blocks"
              :key="block.id"
              class="block-card"
              @click="openLesson(block.lessons[0].id)"
            >
              <div>
                <div class="block-card-top">
                  <span class="block-num">BLOCK {{ block.num }}</span>
                  <span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted);">
                    {{ block.weeks }}
                  </span>
                </div>
                <h3>{{ block.title }}</h3>
                <p>{{ block.summary }}</p>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 12px;">
                <span style="color: var(--accent);">Open Block {{ block.num }} →</span>
                <span style="color: var(--text-muted);">
                  {{ getBlockProgress(block).done }}/{{ getBlockProgress(block).total }} lessons
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================
           2. LESSON READER VIEW
           ======================== -->
      <section v-else-if="currentView === 'lesson'" class="lesson-container">
        <div class="lesson-topbar">
          <div class="breadcrumb">
            <span style="cursor: pointer;" @click="openHome">Home</span>
            <span>/</span>
            <span>Block {{ currentLessonContext.block.num }} ({{ currentLessonContext.block.weeks }})</span>
            <span>/</span>
            <span class="active">Lesson {{ currentLessonContext.lesson.id }}</span>
          </div>
          <div class="stat-pill">
            Progress: {{ getLessonProgress(currentLessonContext.lesson).done }}/{{ getLessonProgress(currentLessonContext.lesson).total }} steps
          </div>
        </div>

        <h1 class="lesson-hero-title">
          {{ currentLessonContext.lesson.id }} — {{ currentLessonContext.lesson.title }}
        </h1>
        <p class="lesson-summary">
          {{ currentLessonContext.lesson.summary }}
        </p>

        <!-- Interview Trap Callout -->
        <div v-if="currentLessonContext.lesson.interviewTrap" class="trap-callout">
          <div class="trap-callout-title">
            ⚡ Guaranteed Interview &amp; Certification Exam Trap
          </div>
          <div class="trap-callout-body">
            {{ currentLessonContext.lesson.interviewTrap }}
          </div>
        </div>

        <!-- Concepts Card -->
        <div class="section-card">
          <div class="section-card-title">
            <span>📚 Technical &amp; Business Architecture Concepts (Uncut)</span>
          </div>

          <div
            v-for="(concept, idx) in currentLessonContext.lesson.concepts"
            :key="idx"
            class="concept-item"
          >
            <div class="concept-item-title">{{ concept.title }}</div>
            <div class="concept-item-body" v-html="concept.body"></div>
          </div>

          <!-- Optional Comparison Table -->
          <div v-if="currentLessonContext.lesson.table" class="table-wrapper" style="margin-top: 22px;">
            <table class="data-table">
              <thead>
                <tr>
                  <th v-for="(h, i) in currentLessonContext.lesson.table.headers" :key="i">
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rIdx) in currentLessonContext.lesson.table.rows" :key="rIdx">
                  <td v-for="(cell, cIdx) in row" :key="cIdx">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Optional Code Block -->
          <div v-if="currentLessonContext.lesson.code" class="code-block-wrap" style="margin-top: 22px;">
            <div class="code-block-header">
              <span>{{ currentLessonContext.lesson.code.filename }}</span>
              <button class="copy-btn" @click="copySnippet(currentLessonContext.lesson.code.snippet)">
                {{ copiedCode ? '✓ Copied' : 'Copy Code' }}
              </button>
            </div>
            <pre class="code-block-pre">{{ currentLessonContext.lesson.code.snippet }}</pre>
          </div>
        </div>

        <!-- Hands-On Interactive Checklist -->
        <div class="steps-card">
          <div class="section-card-title">
            <span>🛠️ Step-by-Step Hands-On Lab (Click each step to check it off)</span>
          </div>
          <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 18px;">
            Complete each action in your Salesforce Org or terminal and click the card to update your progress:
          </p>

          <div
            v-for="(step, sIdx) in currentLessonContext.lesson.steps"
            :key="step.id"
            class="step-check-row"
            :class="{ checked: isStepDone(step.id) }"
            @click="toggleStep(step.id)"
          >
            <div class="custom-checkbox">✓</div>
            <div>
              <div class="step-index-badge">
                STEP {{ sIdx + 1 }} · {{ step.label }}
              </div>
              <div class="step-text" v-html="step.detail"></div>
            </div>
          </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="lesson-nav-footer">
          <button
            v-if="adjacentLessons.prev"
            class="btn-secondary"
            @click="openLesson(adjacentLessons.prev.lesson.id)"
          >
            ← {{ adjacentLessons.prev.lesson.id }}: {{ adjacentLessons.prev.lesson.title }}
          </button>
          <div v-else></div>

          <div style="display: flex; gap: 10px;">
            <button
              class="btn-secondary"
              @click="openExam(currentLessonContext.block.id)"
            >
              ▣ Block {{ currentLessonContext.block.num }} Exam
            </button>
            <button
              v-if="adjacentLessons.next"
              class="btn-primary"
              @click="openLesson(adjacentLessons.next.lesson.id)"
            >
              Next: {{ adjacentLessons.next.lesson.id }} →
            </button>
          </div>
        </div>
      </section>

      <!-- ========================
           3. BLOCK EXAM VIEW
           ======================== -->
      <section v-else-if="currentView === 'exam'" class="lesson-container">
        <div class="lesson-topbar">
          <div class="breadcrumb">
            <span style="cursor: pointer;" @click="openHome">Home</span>
            <span>/</span>
            <span>Block {{ activeExamBlock.num }}</span>
            <span>/</span>
            <span class="active">Validation Exam</span>
          </div>
          <div class="stat-pill">
            Status: {{ completedExams[activeExamBlock.exam.id] ? '✅ Passed' : '⏳ In Progress' }}
          </div>
        </div>

        <h1 class="lesson-hero-title">{{ activeExamBlock.exam.title }}</h1>
        <p class="lesson-summary">
          Answer all questions in this block correctly to unlock the green check badge in the sidebar.
        </p>

        <div
          v-for="(item, qIdx) in activeExamBlock.exam.questions"
          :key="qIdx"
          class="quiz-question-card"
        >
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--accent); margin-bottom: 6px;">
            QUESTION {{ qIdx + 1 }} OF {{ activeExamBlock.exam.questions.length }}
          </div>
          <h3 style="font-size: 17px; color: #fff; margin-bottom: 12px;">
            {{ item.q }}
          </h3>

          <div
            v-for="(opt, optIdx) in item.options"
            :key="optIdx"
            class="quiz-option"
            :class="{
              correct:
                quizSelections[`${activeExamBlock.exam.id}-${qIdx}`] !== undefined &&
                optIdx === item.correct,
              wrong:
                quizSelections[`${activeExamBlock.exam.id}-${qIdx}`] === optIdx &&
                optIdx !== item.correct
            }"
            @click="selectQuizOption(activeExamBlock.exam.id, qIdx, optIdx)"
          >
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">
              {{ ['A', 'B', 'C', 'D'][optIdx] }}.
            </span>
            <span>{{ opt }}</span>
          </div>

          <div
            v-if="quizSelections[`${activeExamBlock.exam.id}-${qIdx}`] !== undefined"
            class="quiz-explanation"
          >
            <strong>Senior Explanation:</strong> {{ item.explanation }}
          </div>
        </div>

        <div class="lesson-nav-footer">
          <button class="btn-secondary" @click="openLesson(activeExamBlock.lessons[0].id)">
            ← Back to Block {{ activeExamBlock.num }}
          </button>
          <button class="btn-primary" @click="openHome">
            Back to Home
          </button>
        </div>
      </section>

      <!-- ========================
           4. MASTER GLOSSARY (A-Z) VIEW
           ======================== -->
      <section v-else-if="currentView === 'glossary'" class="lesson-container">
        <div class="lesson-topbar">
          <div class="breadcrumb">
            <span style="cursor: pointer;" @click="openHome">Home</span>
            <span>/</span>
            <span class="active">Master Salesforce Glossary ({{ filteredGlossaryItems.length }} Terms)</span>
          </div>
        </div>

        <h1 class="lesson-hero-title">Salesforce Architecture &amp; CRM Glossary</h1>
        <p class="lesson-summary">
          Every core Salesforce concept, acronym, and object suffix translated directly into Full-Stack engineering terms.
        </p>

        <!-- Category Filter Pills -->
        <div class="filter-pills">
          <button
            v-for="cat in glossaryCategories"
            :key="cat"
            class="filter-pill"
            :class="{ active: glossaryCategory === cat }"
            @click="glossaryCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Search Input -->
        <div style="margin-bottom: 24px;">
          <input
            v-model="glossarySearch"
            type="text"
            class="search-input"
            style="padding-left: 14px;"
            placeholder="Search any term or Full-Stack equivalent (e.g., OWD, SObject, CPQ, FLS, CDC, Postgres)..."
          />
        </div>

        <div
          v-for="(g, idx) in filteredGlossaryItems"
          :key="idx"
          class="quiz-question-card"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
            <span class="stat-pill" style="color: var(--accent); border-color: var(--accent-border);">
              {{ g.category }}
            </span>
            <span class="stat-pill" style="color: var(--cyan); border-color: rgba(6, 182, 212, 0.35);">
              Full-Stack Equivalent: {{ g.devEquivalent }}
            </span>
          </div>
          <h3 style="font-size: 18px; color: #fff; margin-bottom: 8px;">
            {{ g.term }}
          </h3>
          <p style="font-size: 14.5px; color: var(--text-secondary); line-height: 1.65;">
            {{ g.definition }}
          </p>
        </div>
      </section>

      <!-- ========================
           5. INTERVIEW MASTER BANK VIEW
           ======================== -->
      <section v-else-if="currentView === 'interview'" class="lesson-container">
        <div class="lesson-topbar">
          <div class="breadcrumb">
            <span style="cursor: pointer;" @click="openHome">Home</span>
            <span>/</span>
            <span class="active">Master Interview Bank (Admin + Dev + Architect)</span>
          </div>
          <div class="stat-pill" style="color: var(--emerald);">
            ✓ {{ totalCourseStats.masteredCount }} / {{ totalCourseStats.totalQuestions }} Mastered
          </div>
        </div>

        <h1 class="lesson-hero-title">Salesforce Technical Interview Simulator</h1>
        <p class="lesson-summary">
          Filter by topic, answer out loud in English before revealing the Senior Answer, and mark each question as <strong>"✓ Mastered"</strong> once you can explain it effortlessly.
        </p>

        <!-- Category Filter Pills -->
        <div class="filter-pills">
          <button
            v-for="cat in interviewCategories"
            :key="cat"
            class="filter-pill"
            :class="{ active: interviewCategory === cat }"
            @click="interviewCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Search & Reveal Bar -->
        <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
          <input
            v-model="interviewSearch"
            type="text"
            class="search-input"
            style="padding-left: 14px; flex: 1; min-width: 220px;"
            placeholder="Filter questions by keyword (e.g., Master-Detail, OWD, Queueable, JWT)..."
          />
          <button class="btn-secondary" style="white-space: nowrap; padding: 8px 16px;" @click="revealAllFlashcards">
            👁️ Reveal / Hide All
          </button>
        </div>

        <div
          v-for="iq in filteredInterviewQuestions"
          :key="iq.id"
          class="quiz-question-card"
          :style="masteredQuestions[iq.id] ? 'border-color: rgba(16,185,129,0.4);' : ''"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; flex-wrap: wrap;">
            <span class="stat-pill" style="color: var(--accent); border-color: var(--accent-border);">
              {{ iq.category }}
            </span>
            <div style="display: flex; gap: 8px;">
              <button
                class="copy-btn"
                @click="toggleFlashcard(iq.id)"
              >
                {{ revealedFlashcards[iq.id] ? 'Hide Answer' : '👁️ Reveal Senior Answer' }}
              </button>
              <button
                class="mastered-btn"
                :class="{ done: masteredQuestions[iq.id] }"
                @click="toggleMasteredQuestion(iq.id)"
              >
                {{ masteredQuestions[iq.id] ? '✓ Mastered' : 'Mark Mastered' }}
              </button>
            </div>
          </div>
          <h3 style="font-size: 17px; color: #fff; cursor: pointer;" @click="toggleFlashcard(iq.id)">
            {{ iq.q }}
          </h3>
          <div v-if="revealedFlashcards[iq.id]" class="quiz-explanation" style="margin-top: 14px;">
            {{ iq.a }}
          </div>
        </div>
      </section>

      <!-- ========================
           6. TRANSLATOR TS/SQL -> APEX/LWC VIEW
           ======================== -->
      <section v-else-if="currentView === 'translator'" class="lesson-container">
        <div class="lesson-topbar">
          <div class="breadcrumb">
            <span style="cursor: pointer;" @click="openHome">Home</span>
            <span>/</span>
            <span class="active">Direct Translator: TypeScript / SQL / React → Apex / SOQL / LWC</span>
          </div>
        </div>

        <h1 class="lesson-hero-title">Your Unfair Advantage: Full-Stack JS to Salesforce</h1>
        <p class="lesson-summary">
          You already know these patterns in Node.js, SQL, and React. Here is their exact translation into clean, bulkified Salesforce code.
        </p>

        <div
          v-for="item in translatorItems"
          :key="item.id"
          class="section-card"
        >
          <div class="section-card-title">{{ item.title }}</div>
          <div class="translator-grid">
            <div class="code-block-wrap" style="margin: 0;">
              <div class="code-block-header">
                <span>{{ item.tsTitle }}</span>
              </div>
              <pre class="code-block-pre">{{ item.tsCode }}</pre>
            </div>
            <div class="code-block-wrap" style="margin: 0; border-color: rgba(255, 87, 34, 0.35);">
              <div class="code-block-header">
                <span style="color: var(--accent); font-weight: 700;">{{ item.apexTitle }}</span>
                <button class="copy-btn" @click="copySnippet(item.apexCode)">Copy Apex</button>
              </div>
              <pre class="code-block-pre">{{ item.apexCode }}</pre>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================
           7. ARCHITECT PYRAMID & WEALTH (27 -> 35) VIEW
           ======================== -->
      <section v-else-if="currentView === 'career'" class="lesson-container">
        <div class="lesson-topbar">
          <div class="breadcrumb">
            <span style="cursor: pointer;" @click="openHome">Home</span>
            <span>/</span>
            <span class="active">Application &amp; Integration Architect Pyramid + Wealth Simulator (27→35)</span>
          </div>
        </div>

        <h1 class="lesson-hero-title">
          Your Roadmap to Application &amp; Integration Architect ($120k–$200k+/year)
        </h1>
        <p class="lesson-summary">
          Check off each official Salesforce certification as you earn it and customize your 8-year compounding net worth simulator from age 27 to 35.
        </p>

        <!-- Architect Certification Pyramid -->
        <div class="section-card">
          <div class="section-card-title">
            🏔️ The 3 Phases &amp; Official Certifications (Click each certification when earned)
          </div>

          <div
            v-for="(stage, sIdx) in pyramidStages"
            :key="sIdx"
            class="concept-item"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div class="concept-item-title" style="margin-bottom: 0;">
                {{ stage.phase }} — {{ stage.role }}
              </div>
              <span class="stat-pill" style="color: var(--emerald); border-color: rgba(16,185,129,0.35); font-weight: 700;">
                {{ stage.comp }}
              </span>
            </div>
            <div class="concept-item-body">
              <p style="margin-bottom: 12px;">{{ stage.focus }}</p>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <button
                  v-for="cert in stage.certs"
                  :key="cert"
                  class="mastered-btn"
                  :class="{ done: completedCerts[cert] }"
                  style="padding: 7px 14px; font-size: 12px;"
                  @click="toggleCert(cert)"
                >
                  {{ completedCerts[cert] ? '✅ ' : '⬜ ' }}{{ cert }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Wealth Calculator (27 to 35 years old) -->
        <div class="steps-card">
          <div class="section-card-title">
            📈 Interactive Net Worth Simulator (Age 27 to 35 — Geo-Arbitrage from Colombia)
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 20px;">
            <div style="background: #0c0c10; padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <label style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); display: block; margin-bottom: 6px;">
                Monthly Living Expenses (USD/mo): <strong style="color: #fff;">${{ monthlyLivingCostUsd }} USD</strong>
              </label>
              <input
                v-model="monthlyLivingCostUsd"
                type="range"
                min="1500"
                max="5500"
                step="250"
                style="width: 100%; accent-color: var(--accent);"
              />
            </div>

            <div style="background: #0c0c10; padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <label style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); display: block; margin-bottom: 6px;">
                Annual Compound Return (S&amp;P 500 / ETFs): <strong style="color: var(--emerald);">{{ annualReturnPct }}% / yr</strong>
              </label>
              <input
                v-model="annualReturnPct"
                type="range"
                min="5"
                max="12"
                step="1"
                style="width: 100%; accent-color: var(--emerald);"
              />
            </div>
          </div>

          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Career Stage / Role</th>
                  <th>Gross Monthly Income</th>
                  <th>Annual Invested Savings</th>
                  <th>Cumulative Net Worth (USD)</th>
                  <th>Colombian Pesos (COP)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in wealthProjectionRows" :key="idx">
                  <td style="font-family: var(--font-mono); font-weight: 700; color: #fff;">{{ row.age }}</td>
                  <td>{{ row.role }}</td>
                  <td style="font-family: var(--font-mono);">{{ row.monthlyGross }}</td>
                  <td style="font-family: var(--font-mono); color: var(--emerald);">{{ row.annualSavings }}</td>
                  <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent);">{{ row.netWorthUsd }}</td>
                  <td style="font-family: var(--font-mono); color: #fff;">{{ row.netWorthCop }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
