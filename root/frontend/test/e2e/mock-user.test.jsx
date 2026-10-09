import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../src/App.jsx';
import { DrawerProvider, useDrawer } from '../../src/components/drawer/DrawerContext.jsx';
import GlobalDrawer from '../../src/components/drawer/GlobalDrawer.jsx';

// Mock API layer
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
    repos: [],
  }),
  fetchGitContributions: vi.fn().mockResolvedValue([]),
  fetchLeetcodeStats: vi.fn().mockResolvedValue({
    submitStatsGlobal: {
      acSubmissionNum: [{ difficulty: 'All', count: 100 }],
      totalSubmissionNum: [{ difficulty: 'All', submissions: 200 }],
    },
    profile: { ranking: 1000 },
  }),
  sendContact: vi.fn().mockResolvedValue({ success: true }),
  sendHireRequest: vi.fn().mockResolvedValue({ success: true }),
  sendChatMessage: vi.fn().mockResolvedValue({ text: 'Hello!' }),
}));

function DrawerTriggerHarness() {
  const { openDrawer, drawerState } = useDrawer();
  return (
    <div>
      <button
        type="button"
        data-testid="test-hire-btn"
        onClick={() => openDrawer('hire', { service: 'Contract' })}
      >
        Hire Me
      </button>
      <span data-testid="drawer-status">{drawerState.isOpen ? 'OPEN' : 'CLOSED'}</span>
      <span data-testid="drawer-service">{drawerState.data?.service || ''}</span>
      <GlobalDrawer />
    </div>
  );
}

describe('Mock User Flow Tests (E2E Scaffold)', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.history.pushState({}, '', '/');
  });

  it('Scenario 1: User lands on Home, views hero, and inspects navigation', () => {
    render(<App />);

    const brandLogos = screen.getAllByText('BuiltByBugs');
    expect(brandLogos.length).toBeGreaterThan(0);
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByLabelText('Ask AI Assistant')).toBeInTheDocument();
  });

  it('Scenario 2: User triggers hire drawer action and receives form', async () => {
    render(
      <DrawerProvider>
        <DrawerTriggerHarness />
      </DrawerProvider>
    );

    const button = screen.getByTestId('test-hire-btn');
    const status = screen.getByTestId('drawer-status');
    expect(status.textContent).toBe('CLOSED');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByTestId('drawer-status').textContent).toBe('OPEN');
    expect(screen.getByTestId('drawer-service').textContent).toBe('Contract');
  });
});
