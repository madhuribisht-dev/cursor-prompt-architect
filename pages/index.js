import { useState } from 'react';
import Head from 'next/head';

const APPLE_CHIPS = [
  'async/await', 'Combine', 'CoreData', 'SwiftData',
  'Accessibility / VoiceOver', 'Dark Mode', 'Animations',
  'Networking / URLSession', 'Unit Tests (XCTest)', 'Memory safety / ARC',
  'Performance / Instruments', 'Localization', 'Push notifications',
  'CoreLocation / Maps', 'StoreKit / IAP', 'Widget / Extension',
];

const KOTLIN_CHIPS = [
  'Coroutines / Flow', 'Room DB', 'Retrofit / OkHttp', 'Hilt DI',
  'Jetpack Navigation', 'Material 3', 'DataStore', 'WorkManager',
  'JUnit / Espresso tests', 'Accessibility / TalkBack', 'Firebase', 'KMP sharing',
];

function getAppleSystem({ arch, swiftVer, iosVer, iosMin, platform, ui, task, focuses }) {
  return `You are a senior iOS ${ui} engineer and Swift developer, and an expert Cursor IDE prompt engineer.

Transform the raw developer notes below into a structured, production-quality Cursor IDE prompt.

The output MUST use this EXACT structure and section headings — no deviations:

You are a senior iOS ${ui} engineer and Swift developer.

Task:
[Single crisp sentence — what exactly needs to be built, fixed, or improved. Translate Hindi/Hinglish to English.]

Tech Stack:
- Language: ${swiftVer}
- Platform: ${platform} / ${iosVer} (min deployment: ${iosMin})
- UI Framework: ${ui}
- Architecture: ${arch}
- Task Type: ${task}

Requirements:
- [Expand each raw bullet/idea into a specific, actionable requirement]
- [Include loading states, empty states, and error states even if not mentioned]
- [Include accessibility requirement if UI is involved]
- [Add as many bullets as the input demands — be thorough]

Focus Areas:
1. [Primary technical concern — e.g. business logic, state management]
2. [Error handling and edge cases]
3. [Async/concurrency if applicable]
4. [${focuses || 'Performance and memory safety'}]
5. [UI state updates and user feedback]

Expected Output:
- [List every file, class, struct, protocol, or extension Cursor should produce]
- [Include ViewModel, Repository, Service, Model as appropriate for ${arch}]
- [Include mock/stub/test data builders if task type involves testing]
- [Mention any required protocol-based dependency injection]

Code Standards:
- No force unwrapping (!); use guard let / if let / optional chaining
- Follow ${arch} strictly — no business logic in Views or SwiftUI body blocks
- Use Swift 6 concurrency (async/await, actors, @MainActor) where applicable
- Meaningful naming: no single-letter variables, no magic numbers
- Add inline comments for non-obvious logic only
- All user-facing strings must be localization-ready

Here is the code/module to work on:
[paste your Swift code here]

RULES FOR YOUR OUTPUT:
- Translate all Hindi/Hinglish input to proper technical English inside the prompt
- Expand vague input into precise technical requirements — be specific, not generic
- Infer sensible defaults for anything not mentioned (loading states, empty states, error handling)
- Output ONLY the structured prompt. No preamble, no explanation, no markdown fences.`;
}

function getKotlinSystem({ arch, kotlinVer, androidTarget, androidMin, projectType, ui, task, focuses }) {
  return `You are a senior Android ${ui} engineer and Kotlin developer, and an expert Cursor IDE prompt engineer.

Transform the raw developer notes below into a structured, production-quality Cursor IDE prompt.

The output MUST use this EXACT structure and section headings — no deviations:

You are a senior Android ${ui} engineer and Kotlin developer.

Task:
[Single crisp sentence — what exactly needs to be built, fixed, or improved. Translate Hindi/Hinglish to English.]

Tech Stack:
- Language: ${kotlinVer}
- Project Type: ${projectType}
- Target: ${androidTarget} (min SDK: ${androidMin})
- UI Framework: ${ui}
- Architecture: ${arch}
- Task Type: ${task}

Requirements:
- [Expand each raw bullet/idea into a specific, actionable requirement]
- [Include loading states, empty states, and error states even if not mentioned]
- [Include accessibility requirement if UI is involved]
- [Add as many bullets as the input demands — be thorough]

Focus Areas:
1. [Primary technical concern — e.g. business logic, state management]
2. [Error handling and coroutine exception handling]
3. [Lifecycle awareness and ViewModel scope]
4. [${focuses || 'Performance and memory efficiency'}]
5. [UI state updates and user feedback]

Expected Output:
- [List every file, class, interface, or data class Cursor should produce]
- [Include ViewModel, Repository, UseCase, Model as appropriate for ${arch}]
- [Include mock/stub/test data builders if task type involves testing]
- [Mention any required interface-based dependency injection with Hilt if applicable]

Code Standards:
- Null safety: no !! operator; use ?: elvis or safe calls only
- Immutable state: prefer val over var; expose StateFlow/SharedFlow from ViewModel
- Coroutines over callbacks: use viewModelScope or lifecycleScope
- Follow ${arch} strictly — no business logic in Composables, Activities, or Fragments
- Meaningful naming: no single-letter variables, no magic numbers or hardcoded strings
- All user-facing strings in strings.xml

Here is the code/module to work on:
[paste your Kotlin code here]

RULES FOR YOUR OUTPUT:
- Translate all Hindi/Hinglish input to proper technical English inside the prompt
- Expand vague input into precise technical requirements — be specific, not generic
- Infer sensible defaults for anything not mentioned (loading states, empty states, error handling)
- Output ONLY the structured prompt. No preamble, no explanation, no markdown fences.`;
}

export default function Home() {
  const [platform, setPlatform] = useState('apple');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeChips, setActiveChips] = useState({ apple: [], kotlin: [] });

  const [swiftVer, setSwiftVer] = useState('Swift 6.3');
  const [iosVer, setIosVer] = useState('iOS 26');
  const [iosMin, setIosMin] = useState('iOS 17+');
  const [appleTask, setAppleTask] = useState('New feature');
  const [applePlatform, setApplePlatform] = useState('iPhone');
  const [appleUI, setAppleUI] = useState('SwiftUI');
  const [appleArch, setAppleArch] = useState('MVVM');

  const [kotlinVer, setKotlinVer] = useState('Kotlin 2.3');
  const [androidTarget, setAndroidTarget] = useState('API 35 (Android 15)');
  const [androidMin, setAndroidMin] = useState('API 26 (Android 8.0+)');
  const [kotlinTask, setKotlinTask] = useState('New feature');
  const [kotlinType, setKotlinType] = useState('Android native app');
  const [kotlinUI, setKotlinUI] = useState('Jetpack Compose');
  const [kotlinArch, setKotlinArch] = useState('MVVM + Clean Architecture');

  const [rawInput, setRawInput] = useState('');

  function toggleChip(p, v) {
    setActiveChips(prev => {
      const curr = prev[p];
      return { ...prev, [p]: curr.includes(v) ? curr.filter(x => x !== v) : [...curr, v] };
    });
  }

  async function generate() {
    if (!rawInput.trim()) return;
    setLoading(true);
    setOutput('');

    let systemPrompt, userMessage;

    if (platform === 'apple') {
      const focuses = activeChips.apple.join(', ') || '';
      systemPrompt = getAppleSystem({
        arch: appleArch, swiftVer, iosVer, iosMin,
        platform: applePlatform, ui: appleUI, task: appleTask, focuses,
      });
      userMessage = `RAW DEVELOPER INPUT (may be in English, Hindi, or Hinglish):

${rawInput}

Generate the structured Cursor prompt now.`;
    } else {
      const focuses = activeChips.kotlin.join(', ') || '';
      systemPrompt = getKotlinSystem({
        arch: kotlinArch, kotlinVer, androidTarget, androidMin,
        projectType: kotlinType, ui: kotlinUI, task: kotlinTask, focuses,
      });
      userMessage = `RAW DEVELOPER INPUT (may be in English, Hindi, or Hinglish):

${rawInput}

Generate the structured Cursor prompt now.`;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userMessage }),
      });
      const data = await res.json();
      if (data.error) setOutput('Error: ' + data.error);
      else setOutput(data.result);
    } catch (e) {
      setOutput('Network error. Please try again.');
    }
    setLoading(false);
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const chips = platform === 'apple' ? APPLE_CHIPS : KOTLIN_CHIPS;
  const chipKey = platform === 'apple' ? 'apple' : 'kotlin';

  return (
    <>
      <Head>
        <title>Cursor Prompt Architect</title>
        <meta name="description" content="Transform raw ideas into precision Cursor prompts for Swift/iOS and Kotlin/Android" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={s.page}>
        <div style={s.container}>

          <div style={s.header}>
            <h1 style={s.h1}>⌘ Cursor Prompt Architect</h1>
            <p style={s.subtitle}>
              Paste messy notes in <strong>English या Hindi</strong> — get structured Cursor prompts with Task, Requirements, Focus Areas &amp; Expected Output.
            </p>
          </div>

          <div style={s.tabs}>
            <button style={platform === 'apple' ? { ...s.tab, ...s.tabActive } : s.tab} onClick={() => setPlatform('apple')}>
              🍎 Swift / iOS
              <span style={{ ...s.badge, background: '#fdf2e6', color: '#b35a00' }}>6.3</span>
            </button>
            <button style={platform === 'kotlin' ? { ...s.tab, ...s.tabActive } : s.tab} onClick={() => setPlatform('kotlin')}>
              🤖 Kotlin / Android
              <span style={{ ...s.badge, background: '#e8f0fe', color: '#3c4a9e' }}>2.3</span>
            </button>
          </div>

          {platform === 'apple' && (
            <div style={s.card}>
              <div style={s.sectionLabel}>Swift & iOS versions</div>
              <div style={s.grid3}>
                <Sel label="Swift version" value={swiftVer} onChange={setSwiftVer} options={[
                  ['Swift 6.3', 'Swift 6.3 ✦ latest'],
                  ['Swift 6.2', 'Swift 6.2'],
                  ['Swift 6.1', 'Swift 6.1'],
                  ['Swift 6.0', 'Swift 6.0'],
                  ['Swift 5.10', 'Swift 5.10'],
                  ['Swift 5.9', 'Swift 5.9'],
                ]} />
                <Sel label="iOS target" value={iosVer} onChange={setIosVer} options={[
                  ['iOS 26', 'iOS 26 ✦ latest'],
                  ['iOS 18', 'iOS 18'],
                  ['iOS 17', 'iOS 17'],
                  ['iOS 16', 'iOS 16'],
                  ['iOS 15', 'iOS 15'],
                  ['iOS 14', 'iOS 14'],
                ]} />
                <Sel label="Min deployment" value={iosMin} onChange={setIosMin} options={[
                  ['iOS 17+', 'iOS 17+ (recommended)'],
                  ['iOS 16+', 'iOS 16+'],
                  ['iOS 15+', 'iOS 15+'],
                  ['iOS 14+', 'iOS 14+'],
                  ['iOS 18+', 'iOS 18+'],
                ]} />
              </div>
              <div style={s.sectionLabel}>Project setup</div>
              <div style={s.grid2}>
                <Sel label="Task type" value={appleTask} onChange={setAppleTask} options={[
                  ['New feature', 'New feature'],
                  ['Bug fix', 'Bug fix'],
                  ['Refactor', 'Refactor / cleanup'],
                  ['Write unit tests', 'Write unit tests'],
                  ['Write UI tests', 'Write UI tests'],
                  ['UI component', 'UI component'],
                  ['API / Networking', 'API / Networking'],
                  ['Architecture design', 'Architecture design'],
                  ['Performance optimization', 'Performance optimization'],
                  ['Code review', 'Code review'],
                ]} />
                <Sel label="Target platform" value={applePlatform} onChange={setApplePlatform} options={[
                  ['iPhone', 'iPhone'],
                  ['iPhone + iPad', 'iPhone + iPad'],
                  ['iPad only', 'iPad only'],
                  ['macOS (Catalyst)', 'macOS (Catalyst)'],
                  ['watchOS', 'watchOS'],
                  ['tvOS', 'tvOS'],
                  ['visionOS', 'visionOS'],
                ]} />
                <Sel label="UI framework" value={appleUI} onChange={setAppleUI} options={[
                  ['SwiftUI', 'SwiftUI'],
                  ['UIKit', 'UIKit'],
                  ['SwiftUI + UIKit (interop)', 'SwiftUI + UIKit'],
                ]} />
                <Sel label="Architecture" value={appleArch} onChange={setAppleArch} options={[
                  ['MVVM', 'MVVM'],
                  ['MVC', 'MVC'],
                  ['VIPER', 'VIPER'],
                  ['TCA (The Composable Architecture)', 'TCA'],
                  ['Clean Architecture', 'Clean Architecture'],
                ]} />
              </div>
            </div>
          )}

          {platform === 'kotlin' && (
            <div style={s.card}>
              <div style={s.sectionLabel}>Kotlin & Android versions</div>
              <div style={s.grid3}>
                <Sel label="Kotlin version" value={kotlinVer} onChange={setKotlinVer} options={[
                  ['Kotlin 2.3', 'Kotlin 2.3 ✦ latest stable'],
                  ['Kotlin 2.2', 'Kotlin 2.2'],
                  ['Kotlin 2.1', 'Kotlin 2.1'],
                  ['Kotlin 2.0 (K2)', 'Kotlin 2.0 (K2)'],
                  ['Kotlin 1.9', 'Kotlin 1.9'],
                ]} />
                <Sel label="Android API target" value={androidTarget} onChange={setAndroidTarget} options={[
                  ['API 35 (Android 15)', 'API 35 — Android 15'],
                  ['API 34 (Android 14)', 'API 34 — Android 14'],
                  ['API 33 (Android 13)', 'API 33 — Android 13'],
                  ['API 32 (Android 12L)', 'API 32 — Android 12L'],
                ]} />
                <Sel label="Min SDK" value={androidMin} onChange={setAndroidMin} options={[
                  ['API 26 (Android 8.0+)', 'API 26 — Android 8+'],
                  ['API 24 (Android 7.0+)', 'API 24 — Android 7+'],
                  ['API 28 (Android 9.0+)', 'API 28 — Android 9+'],
                  ['API 21 (Android 5.0+)', 'API 21 — Android 5+'],
                ]} />
              </div>
              <div style={s.sectionLabel}>Project setup</div>
              <div style={s.grid2}>
                <Sel label="Task type" value={kotlinTask} onChange={setKotlinTask} options={[
                  ['New feature', 'New feature'],
                  ['Bug fix', 'Bug fix'],
                  ['Refactor', 'Refactor / cleanup'],
                  ['Write unit tests', 'Write unit tests'],
                  ['Write UI tests', 'Write UI tests'],
                  ['UI component', 'UI component'],
                  ['API / Networking', 'API / Networking'],
                  ['Architecture design', 'Architecture design'],
                  ['Performance optimization', 'Performance optimization'],
                ]} />
                <Sel label="Project type" value={kotlinType} onChange={setKotlinType} options={[
                  ['Android native app', 'Android native'],
                  ['Kotlin Multiplatform (KMP) — Android + iOS', 'KMP (Android + iOS)'],
                  ['Kotlin Multiplatform — Android + iOS + Desktop', 'KMP (all platforms)'],
                  ['Compose Multiplatform', 'Compose Multiplatform'],
                ]} />
                <Sel label="UI framework" value={kotlinUI} onChange={setKotlinUI} options={[
                  ['Jetpack Compose', 'Jetpack Compose'],
                  ['XML Views (View system)', 'XML Views'],
                  ['Jetpack Compose + XML interop', 'Compose + XML interop'],
                ]} />
                <Sel label="Architecture" value={kotlinArch} onChange={setKotlinArch} options={[
                  ['MVVM + Clean Architecture', 'MVVM + Clean'],
                  ['MVI', 'MVI'],
                  ['MVP', 'MVP'],
                  ['MVVM', 'MVVM'],
                ]} />
              </div>
            </div>
          )}

          <div style={s.card}>
            <div style={s.sectionLabel}>Focus areas (optional — click to select)</div>
            <div style={s.chipRow}>
              {chips.map(v => (
                <button
                  key={v}
                  style={activeChips[chipKey].includes(v) ? { ...s.chip, ...s.chipActive } : s.chip}
                  onClick={() => toggleChip(chipKey, v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <div style={s.sectionLabel}>Your raw input — English या Hindi में लिखें</div>
            <textarea
              style={s.textarea}
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              placeholder={`Dump your thoughts or paste your Swift/Kotlin code here...\n\nExamples:\n• "write test cases for login module"\n• "login screen banana hai with biometric"\n• Paste your actual Swift/Kotlin code and describe what you need`}
            />
          </div>

          <button style={loading ? { ...s.btnMain, opacity: 0.6 } : s.btnMain} onClick={generate} disabled={loading}>
            {loading ? '⏳ Crafting structured prompt...' : '✦ Generate Cursor prompt'}
          </button>

          {output && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={s.sectionLabel}>Generated Cursor prompt — ready to paste into Cursor</div>
              <div style={s.outputBox}>
                <pre style={s.outputText}>{output}</pre>
                <div style={s.actionRow}>
                  <button style={s.btnSm} onClick={copyOutput}>
                    {copied ? '✓ Copied!' : '⎘ Copy to clipboard'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={s.footer}>
            Built for your team · Swift 6.3 · iOS 26 · Kotlin 2.3 · Android 15 · Powered by Groq (free)
          </div>
        </div>
      </div>
    </>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div style={s.selWrap}>
      <label style={s.selLabel}>{label}</label>
      <select style={s.select} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(([val, txt]) => <option key={val} value={val}>{txt}</option>)}
      </select>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1rem 4rem' },
  container: { maxWidth: 720, margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  h1: { fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 6 },
  subtitle: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
  tabs: { display: 'flex', gap: 0, marginBottom: '1.25rem', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content' },
  tab: { fontSize: 13, padding: '8px 20px', cursor: 'pointer', color: 'var(--text2)', background: 'var(--surface2)', border: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 400, borderRight: '1px solid var(--border)' },
  tabActive: { background: 'var(--surface)', color: 'var(--text)', fontWeight: 500 },
  badge: { fontSize: 10, padding: '1px 7px', borderRadius: 20, fontWeight: 600 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem' },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: '1rem' },
  selWrap: { display: 'flex', flexDirection: 'column', gap: 4 },
  selLabel: { fontSize: 11, color: 'var(--text2)', fontWeight: 500 },
  select: { width: '100%', padding: '7px 10px', fontSize: 13, border: '1px solid var(--border2)', borderRadius: 6, background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer' },
  chipRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip: { fontSize: 12, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border2)', color: 'var(--text2)', cursor: 'pointer', background: 'var(--surface2)', transition: 'all 0.12s' },
  chipActive: { background: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)', fontWeight: 500 },
  textarea: { width: '100%', minHeight: 150, padding: '10px 12px', fontSize: 14, border: '1px solid var(--border2)', borderRadius: 6, background: 'var(--surface)', color: 'var(--text)', resize: 'vertical', lineHeight: 1.6, outline: 'none' },
  btnMain: { width: '100%', padding: 12, fontSize: 15, fontWeight: 600, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', letterSpacing: '0.01em' },
  outputBox: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem' },
  outputText: { fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace', fontSize: 12.5, lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 },
  actionRow: { display: 'flex', gap: 8, marginTop: 12 },
  btnSm: { fontSize: 12, padding: '5px 14px', borderRadius: 6, border: '1px solid var(--border2)', background: 'var(--surface)', color: 'var(--text2)', cursor: 'pointer' },
  footer: { marginTop: '2.5rem', textAlign: 'center', fontSize: 12, color: 'var(--text3)' },
};
