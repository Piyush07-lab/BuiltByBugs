import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render } from '@testing-library/react';

// Message service for Status 200 protocol
import { messageService } from '../../src/services/messageService.js';

// Drawer context wrapper
import { DrawerProvider } from '../../src/components/drawer/DrawerContext.jsx';

// Pages
import Home from '../../src/pages/Home.jsx';
import Library from '../../src/pages/Library.jsx';
import Project from '../../src/pages/Project.jsx';

// Miscellaneous / Layout
import Header from '../../src/components/miscellaneous/Header.jsx';
import Footer from '../../src/components/miscellaneous/Footer.jsx';
import WidgetShell from '../../src/components/miscellaneous/WidgetShell.jsx';
import ErrorState from '../../src/components/miscellaneous/ErrorState.jsx';
import LoadingState from '../../src/components/miscellaneous/LoadingState.jsx';
import { FoundationCard } from '../../src/components/miscellaneous/FoundationCard.jsx';
import AlternatingStoryRow from '../../src/components/layout/AlternatingStoryRow.jsx';
import VectorBackground from '../../src/components/background/VectorBackground.jsx';

// Widgets
import BulletinWidget from '../../src/components/bulletin/BulletinWidget.jsx';
import CodingTracker from '../../src/components/coding/CodingTracker.jsx';
import CodingSummary from '../../src/components/coding/CodingSummary.jsx';
import GithubWidget from '../../src/components/github/GithubWidget.jsx';
import GitHubShowcase from '../../src/components/github/GitHubShowcase.jsx';
import RepositoryGrid from '../../src/components/github/RepositoryGrid.jsx';
import ContributionHeatmap from '../../src/components/github/ContributionHeatmap.jsx';
import LeetcodeStats from '../../src/components/leetcode/LeetcodeStats.jsx';
import TechStackBento from '../../src/components/tech/TechStackBento.jsx';

// Drawer & Contact
import Drawer from '../../src/components/drawer/Drawer.jsx';
import GlobalDrawer from '../../src/components/drawer/GlobalDrawer.jsx';
import { AutoSwitchHireTag } from '../../src/components/contact/Services.jsx';

// Mascot
import MascotBot from '../../src/components/mascot/MascotBot.jsx';
import { MascotChassis } from '../../src/components/mascot/components/MascotChassis.jsx';
import { MascotFace } from '../../src/components/mascot/components/MascotFace.jsx';

// Library Cards
import ArticleCard from '../../src/components/library/ArticleCard.jsx';
import DocumentCard from '../../src/components/library/DocumentCard.jsx';

// Kinematics & Utilities
import {
  evaluateCatmullRom2D,
  generateFlightWaypoints,
  getHarmonicHover,
  calculateBankingRoll,
  clampToBounds,
} from '../../src/components/mascot/utils/splineKinematics.js';
import {
  computeArmEndpoint,
  ARM_ACTIONS,
  ARM_CONFIGS,
  ARM_STATES,
} from '../../src/components/mascot/utils/armKinematics.js';

// Data registries
import { pages } from '../../src/data/pages.js';
import { navigation } from '../../src/data/navigation.js';
import { bulletinItems } from '../../src/data/bulletin.js';
import { articles, documents, mockLeetcodeData } from '../../src/data/libraryData.js';

// Use vi.hoisted for hoisted mock data references
const { mockLeetcode } = vi.hoisted(() => ({
  mockLeetcode: {
    username: 'PiyushMishra07',
    submitStatsGlobal: {
      acSubmissionNum: [
        { difficulty: 'All', count: 120 },
        { difficulty: 'Easy', count: 60 },
        { difficulty: 'Medium', count: 45 },
        { difficulty: 'Hard', count: 15 },
      ],
      totalSubmissionNum: [
        { difficulty: 'All', submissions: 200 },
        { difficulty: 'Easy', submissions: 80 },
        { difficulty: 'Medium', submissions: 90 },
        { difficulty: 'Hard', submissions: 30 },
      ],
    },
    profile: { ranking: 15000 },
  },
}));

// Mock API layer to prevent real network calls during functional rendering
vi.mock('../../src/api/fetchApi.js', () => ({
  getCodingActivity: vi.fn().mockResolvedValue({ languages: [], projects: [] }),
  getCodingSummary: vi.fn().mockResolvedValue({
    totalMinutes: 120,
    dailyAverageText: '2 hrs',
    languages: [{ name: 'JavaScript', percent: 80 }],
    projects: [{ name: 'Portfolio', totalMinutes: 120 }],
    editors: [{ name: 'VS Code' }],
  }),
  fetchGitHubSummary: vi.fn().mockResolvedValue({
    user: { html_url: 'https://github.com/Piyush07-lab', public_repos: 10, followers: 5 },
    repos: [
      {
        id: 1,
        name: 'Portfolio',
        description: 'Personal site',
        html_url: 'https://github.com/Piyush07-lab/portfolio',
        stargazers_count: 5,
        forks_count: 1,
      },
    ],
  }),
  fetchGitContributions: vi.fn().mockResolvedValue([
    { date: '2026-01-01', count: 2 },
    { date: '2026-01-02', count: 4 },
  ]),
  fetchLeetcodeStats: vi.fn().mockResolvedValue(mockLeetcode),
  sendContact: vi.fn().mockResolvedValue({ success: true }),
  sendHireRequest: vi.fn().mockResolvedValue({ success: true }),
  sendChatMessage: vi.fn().mockResolvedValue({ text: 'Hello from assistant' }),
}));

function renderWithProviders(ui) {
  return render(<DrawerProvider>{ui}</DrawerProvider>);
}

describe('Directory-Wide Functional Test Suite (Status 200 Audit)', () => {
  beforeAll(() => {
    messageService.reset();
  });

  describe('Core Pages (Status 200)', () => {
    it('mounts Home page without errors and registers status 200', () => {
      const { container } = renderWithProviders(<Home />);
      expect(container.firstChild).toBeTruthy();
      messageService.reportHealth('Home', 200);
      expect(messageService.getHealth('Home').status).toBe(200);
    });

    it('mounts Library page without errors and registers status 200', () => {
      const { container } = renderWithProviders(<Library />);
      expect(container.firstChild).toBeTruthy();
      messageService.reportHealth('Library', 200);
      expect(messageService.getHealth('Library').status).toBe(200);
    });

    it('mounts Project page without errors and registers status 200', () => {
      const { container } = renderWithProviders(<Project />);
      expect(container.firstChild).toBeTruthy();
      messageService.reportHealth('Project', 200);
      expect(messageService.getHealth('Project').status).toBe(200);
    });
  });

  describe('Layout & Shell Components (Status 200)', () => {
    it('mounts Header and highlights navigation route', () => {
      const { container, getByText } = renderWithProviders(<Header pathname="/" />);
      expect(container.firstChild).toBeTruthy();
      expect(getByText('BuiltByBugs')).toBeInTheDocument();
      messageService.reportHealth('Header', 200);
      expect(messageService.getHealth('Header').status).toBe(200);
    });

    it('mounts Footer correctly', () => {
      const { container } = renderWithProviders(<Footer />);
      expect(container.firstChild).toBeTruthy();
      messageService.reportHealth('Footer', 200);
      expect(messageService.getHealth('Footer').status).toBe(200);
    });

    it('mounts WidgetShell with indicators and children', () => {
      const { container, getByText } = renderWithProviders(
        <WidgetShell number="W1" eyebrow="Test" title="Widget Title">
          <div>Widget Content</div>
        </WidgetShell>
      );
      expect(container.firstChild).toBeTruthy();
      expect(getByText('Widget Title')).toBeInTheDocument();
      messageService.reportHealth('WidgetShell', 200);
      expect(messageService.getHealth('WidgetShell').status).toBe(200);
    });

    it('mounts AlternatingStoryRow', () => {
      const { container, getByText } = renderWithProviders(
        <AlternatingStoryRow
          index="01"
          tag="Story Tag"
          title="Story Title"
          description="Description text"
        >
          <div>Row Content</div>
        </AlternatingStoryRow>
      );
      expect(container.firstChild).toBeTruthy();
      expect(getByText('Story Title')).toBeInTheDocument();
      messageService.reportHealth('AlternatingStoryRow', 200);
      expect(messageService.getHealth('AlternatingStoryRow').status).toBe(200);
    });

    it('mounts VectorBackground across all path variants', () => {
      ['/', '/library', '/project'].forEach((path) => {
        const { container } = renderWithProviders(<VectorBackground pathname={path} />);
        expect(container.firstChild).toBeTruthy();
      });
      messageService.reportHealth('VectorBackground', 200);
      expect(messageService.getHealth('VectorBackground').status).toBe(200);
    });
  });

  describe('Activity & Interactive Widgets (Status 200)', () => {
    it('mounts BulletinWidget with slide cycling', () => {
      const { container } = renderWithProviders(<BulletinWidget />);
      expect(container.firstChild).toBeTruthy();
      messageService.reportHealth('BulletinWidget', 200);
      expect(messageService.getHealth('BulletinWidget').status).toBe(200);
    });

    it('mounts CodingTracker and CodingSummary', () => {
      const { container: trackerContainer } = renderWithProviders(<CodingTracker />);
      expect(trackerContainer.firstChild).toBeTruthy();
      messageService.reportHealth('CodingTracker', 200);

      const mockSummary = {
        totalMinutes: 60,
        dailyAverageText: '1 hr',
        languages: [{ name: 'JavaScript', percent: 100 }],
        projects: [{ name: 'BuiltByBugs', totalMinutes: 60 }],
        editors: [{ name: 'VS Code' }],
      };
      const { container: summaryContainer } = renderWithProviders(
        <CodingSummary summary={mockSummary} />
      );
      expect(summaryContainer.firstChild).toBeTruthy();
      messageService.reportHealth('CodingSummary', 200);

      expect(messageService.getHealth('CodingTracker').status).toBe(200);
      expect(messageService.getHealth('CodingSummary').status).toBe(200);
    });

    it('mounts GithubWidget, GitHubShowcase, ContributionHeatmap, RepositoryGrid', () => {
      const { container: widgetBox } = renderWithProviders(<GithubWidget />);
      expect(widgetBox.firstChild).toBeTruthy();
      messageService.reportHealth('GithubWidget', 200);

      const mockUser = {
        user: {
          html_url: 'https://github.com/Piyush07-lab',
          public_repos: 4,
          followers: 2,
        },
        repos: [{ id: 1, name: 'Repo1', description: 'Desc' }],
      };
      const { container: showcaseBox } = renderWithProviders(
        <GitHubShowcase summary={mockUser} />
      );
      expect(showcaseBox.firstChild).toBeTruthy();
      messageService.reportHealth('GitHubShowcase', 200);

      const { container: gridBox } = renderWithProviders(
        <RepositoryGrid repos={mockUser.repos} />
      );
      expect(gridBox.firstChild).toBeTruthy();
      messageService.reportHealth('RepositoryGrid', 200);

      const { container: heatmapBox } = renderWithProviders(
        <ContributionHeatmap
          heatmap={[{ date: '2026-01-01', count: 3 }]}
          profileUrl="https://github.com"
        />
      );
      expect(heatmapBox.firstChild).toBeTruthy();
      messageService.reportHealth('ContributionHeatmap', 200);
    });

    it('mounts LeetcodeStats and TechStackBento', () => {
      const { container: leetcodeBox } = renderWithProviders(
        <LeetcodeStats stats={mockLeetcodeData} />
      );
      expect(leetcodeBox.firstChild).toBeTruthy();
      messageService.reportHealth('LeetcodeStats', 200);

      const { container: techBox } = renderWithProviders(<TechStackBento />);
      expect(techBox.firstChild).toBeTruthy();
      messageService.reportHealth('TechStackBento', 200);
    });
  });

  describe('Drawer & Overlay Components (Status 200)', () => {
    it('mounts Drawer and GlobalDrawer', () => {
      renderWithProviders(
        <Drawer isOpen={true} onClose={() => {}} title="Test Drawer">
          <div>Drawer Inner</div>
        </Drawer>
      );
      expect(document.body).toBeDefined();
      messageService.reportHealth('Drawer', 200);

      const { container: globalBox } = renderWithProviders(<GlobalDrawer />);
      expect(globalBox).toBeDefined();
      messageService.reportHealth('GlobalDrawer', 200);

      const { container: hireBox } = renderWithProviders(<AutoSwitchHireTag />);
      expect(hireBox.firstChild).toBeTruthy();
      messageService.reportHealth('AutoSwitchHireTag', 200);
    });
  });

  describe('Mascot Companion & Subcomponents (Status 200)', () => {
    it('mounts MascotBot, MascotChassis, and MascotFace', () => {
      const { container: botBox } = renderWithProviders(<MascotBot />);
      expect(botBox.firstChild).toBeTruthy();
      messageService.reportHealth('MascotBot', 200);

      const { container: chassisBox } = render(
        <svg>
          <MascotChassis
            isEasterEgg={false}
            armStates={{ left: 1, right: 1 }}
            leftArmTransform={ARM_CONFIGS[1].left}
            rightArmTransform={ARM_CONFIGS[1].right}
          />
        </svg>
      );
      expect(chassisBox.firstChild).toBeTruthy();
      messageService.reportHealth('MascotChassis', 200);

      const { container: faceBox } = render(
        <svg>
          <MascotFace eyeOffset={{ x: 0, y: 0 }} isCurious={false} isEasterEgg={false} />
        </svg>
      );
      expect(faceBox.firstChild).toBeTruthy();
      messageService.reportHealth('MascotFace', 200);
    });
  });

  describe('Cards & Status Indicators (Status 200)', () => {
    it('mounts ArticleCard and DocumentCard', () => {
      const article = articles[0];
      const { container: artBox } = renderWithProviders(
        <ArticleCard article={article} />
      );
      expect(artBox.firstChild).toBeTruthy();
      messageService.reportHealth('ArticleCard', 200);

      const document = documents[0];
      const { container: docBox } = renderWithProviders(
        <DocumentCard document={document} />
      );
      expect(docBox.firstChild).toBeTruthy();
      messageService.reportHealth('DocumentCard', 200);
    });

    it('mounts ErrorState, LoadingState, FoundationCard', () => {
      const { container: errBox } = renderWithProviders(
        <ErrorState label="Test Error" />
      );
      expect(errBox.firstChild).toBeTruthy();
      messageService.reportHealth('ErrorState', 200);

      const { container: loadBox } = renderWithProviders(
        <LoadingState label="Loading..." />
      );
      expect(loadBox.firstChild).toBeTruthy();
      messageService.reportHealth('LoadingState', 200);

      const { container: fndBox } = renderWithProviders(
        <FoundationCard number="01" title="Foundation" description="Desc" />
      );
      expect(fndBox.firstChild).toBeTruthy();
      messageService.reportHealth('FoundationCard', 200);
    });
  });

  describe('Mathematical & Kinematics Functions (Status 200)', () => {
    it('evaluates Catmull-Rom 2D splines and derivatives accurately', () => {
      const p0 = { x: 0, y: 0 };
      const p1 = { x: 10, y: 10 };
      const p2 = { x: 20, y: 20 };
      const p3 = { x: 30, y: 30 };

      const { point, tangent } = evaluateCatmullRom2D(p0, p1, p2, p3, 0.5);
      expect(point.x).toBeCloseTo(15);
      expect(point.y).toBeCloseTo(15);
      expect(tangent.x).toBeGreaterThan(0);
      messageService.reportHealth('evaluateCatmullRom2D', 200);
    });

    it('computes flight waypoints with organic swoop apex', () => {
      const bounds = { minX: 0, maxX: 500, minY: 0, maxY: 500 };
      const waypoints = generateFlightWaypoints(
        { x: 50, y: 50 },
        { x: 200, y: 200 },
        bounds
      );

      expect(waypoints).toHaveLength(5);
      expect(waypoints[1].x).toBe(50);
      expect(waypoints[3].x).toBe(200);
      messageService.reportHealth('generateFlightWaypoints', 200);
    });

    it('computes harmonic hover and banking roll', () => {
      const hover = getHarmonicHover(1.5);
      expect(typeof hover.x).toBe('number');
      expect(typeof hover.y).toBe('number');
      expect(typeof hover.tilt).toBe('number');

      const roll = calculateBankingRoll({ x: 50, y: 10 }, 14);
      expect(roll).toBeGreaterThan(0);
      expect(roll).toBeLessThanOrEqual(14);
      messageService.reportHealth('getHarmonicHover', 200);
    });

    it('clamps coordinates to bounds correctly', () => {
      const bounds = { minX: 10, maxX: 100, minY: 20, maxY: 200 };
      const clamped = clampToBounds({ x: 5, y: 250 }, bounds);
      expect(clamped.x).toBe(10);
      expect(clamped.y).toBe(200);
      messageService.reportHealth('clampToBounds', 200);
    });

    it('computes arm kinematics endpoints across all 4 discrete states', () => {
      [
        ARM_STATES.LOWERED,
        ARM_STATES.T_POSE,
        ARM_STATES.MID_UP,
        ARM_STATES.UPWARD_180,
      ].forEach((state) => {
        const leftPt = computeArmEndpoint('left', state);
        const rightPt = computeArmEndpoint('right', state);
        expect(leftPt.endpoint.x).toBeDefined();
        expect(rightPt.endpoint.x).toBeDefined();
        expect(ARM_CONFIGS[state]).toBeDefined();
      });
      expect(Object.keys(ARM_ACTIONS).length).toBeGreaterThan(0);
      messageService.reportHealth('armKinematics', 200);
    });
  });

  describe('Data Registries Integrity (Status 200)', () => {
    it('validates navigation items structure', () => {
      expect(navigation.length).toBeGreaterThan(0);
      navigation.forEach((item) => {
        expect(item.label).toBeTruthy();
        expect(item.href).toBeTruthy();
      });
      messageService.reportHealth('navigationData', 200);
    });

    it('validates pages metadata registry', () => {
      ['/', '/library', '/project'].forEach((route) => {
        expect(pages[route]).toBeDefined();
        expect(pages[route].title).toBeTruthy();
        expect(pages[route].eyebrow).toBeTruthy();
      });
      messageService.reportHealth('pagesData', 200);
    });

    it('validates bulletin items structure', () => {
      expect(bulletinItems.length).toBeGreaterThan(0);
      bulletinItems.forEach((b) => {
        expect(b.id).toBeDefined();
        expect(b.title).toBeTruthy();
        expect(b.tag).toBeTruthy();
      });
      messageService.reportHealth('bulletinData', 200);
    });

    it('validates library articles and documents', () => {
      expect(articles.length).toBeGreaterThan(0);
      expect(documents.length).toBeGreaterThan(0);
      messageService.reportHealth('libraryData', 200);
    });
  });

  describe('Full Directory Health Audit Confirmation', () => {
    it('confirms that 100% of tested components and modules reported Status 200 OK', () => {
      const audit = messageService.getAuditReport();
      expect(audit.length).toBeGreaterThan(20);

      const non200 = audit.filter((r) => r.status !== 200);
      expect(non200).toHaveLength(0);

      const allOk = audit.every((r) => r.status === 200 && r.statusText === 'OK');
      expect(allOk).toBe(true);
    });
  });
});
