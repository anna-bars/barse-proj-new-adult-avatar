import { useState, useEffect, useRef } from 'react'
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-webgl2'
import avatarRiv from './assets/adult-avatar.riv'

const STATE_MACHINE = 'Adult Avatar Controller'

const HAIR_VARIANTS = ['Short/Spiky', 'Side Hair', 'Braids']
const HAIR_COLORS = ['Dark Brown', 'Chestnut', 'Auburn', 'Orange/Red', 'Blonde']
const SKIN_VARIANTS = ['Light', 'Palest', 'Medium', 'Tan', 'Deep']
const EYE_COLORS = [ 'Dark Brown','Dark Green', 'Hazel', 'Blue-Gray', 'Amber/Gold']
const OUTFIT_COLORS = ['Purple (base)', 'Blue', 'Green', 'Red', 'Gold']

export default function App() {
  const [hairVariant, setHairVariant] = useState(0)
  const [hairColor, setHairColor] = useState(0)
  const [skin, setSkin] = useState(0)
  const [eyeColor, setEyeColor] = useState(0)
  const [outfitColor, setOutfitColor] = useState(0)

  const [swordVisible, setSwordVisible] = useState(false)
  const [swordCharge, setSwordCharge] = useState(0)
  const [shieldVisible, setShieldVisible] = useState(false)
  const [shieldCharge, setShieldCharge] = useState(0)

  const [isTalking, setIsTalking] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)

  const [blinkFeed, setBlinkFeed] = useState({ count: 0, lastAt: null })
  const [swordGlintFeed, setSwordGlintFeed] = useState({ count: 0, lastAt: null })
  const [shieldGlintFeed, setShieldGlintFeed] = useState({ count: 0, lastAt: null })

  const { rive, RiveComponent } = useRive({
    src: avatarRiv,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  })

  // ---- State Machine inputs (behavior / motion) ----
  const hairVariantsInput = useStateMachineInput(rive, STATE_MACHINE, 'hairVariants')
  const hairColorInput = useStateMachineInput(rive, STATE_MACHINE, 'hairColor')
  const skinVariantsInput = useStateMachineInput(rive, STATE_MACHINE, 'skinVariants')
  const eyeColorInput = useStateMachineInput(rive, STATE_MACHINE, 'eyeColor')
  const outfitColorInput = useStateMachineInput(rive, STATE_MACHINE, 'outfitColor')
  const swordVisibleInput = useStateMachineInput(rive, STATE_MACHINE, 'swordVisible')
  const swordChargeInput = useStateMachineInput(rive, STATE_MACHINE, 'swordCharge')
  const shieldVisibleInput = useStateMachineInput(rive, STATE_MACHINE, 'shieldVisible')
  const shieldChargeInput = useStateMachineInput(rive, STATE_MACHINE, 'shieldCharge')
  const isTalkingInput = useStateMachineInput(rive, STATE_MACHINE, 'isTalking')
  const isCelebratingInput = useStateMachineInput(rive, STATE_MACHINE, 'isCelebrating')
  const blink = useStateMachineInput(rive, STATE_MACHINE, 'Blink')
  const swordGlint = useStateMachineInput(rive, STATE_MACHINE, 'SwordGlint')
  const shieldGlint = useStateMachineInput(rive, STATE_MACHINE, 'ShieldGlint')

  // Match canvas backing resolution to its displayed size (+ devicePixelRatio)
  useEffect(() => {
    if (!rive) return
    const resize = () => rive.resizeDrawingSurfaceToCanvas()
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [rive])

  // Auto Blink — random 3–6s, as documented
  const blinkTimeout = useRef(null)
  useEffect(() => {
    if (!blink) return
    const schedule = () => {
      const delay = 3000 + Math.random() * 3000
      blinkTimeout.current = setTimeout(() => {
        blink.fire()
        setBlinkFeed((f) => ({ count: f.count + 1, lastAt: Date.now() }))
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(blinkTimeout.current)
  }, [blink])

  // Auto SwordGlint / ShieldGlint — random 8–15s, as documented
  const swordGlintTimeout = useRef(null)
  useEffect(() => {
    if (!swordGlint) return
    const schedule = () => {
      const delay = 8000 + Math.random() * 7000
      swordGlintTimeout.current = setTimeout(() => {
        swordGlint.fire()
        setSwordGlintFeed((f) => ({ count: f.count + 1, lastAt: Date.now() }))
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(swordGlintTimeout.current)
  }, [swordGlint])

  const shieldGlintTimeout = useRef(null)
  useEffect(() => {
    if (!shieldGlint) return
    const schedule = () => {
      const delay = 8000 + Math.random() * 7000
      shieldGlintTimeout.current = setTimeout(() => {
        shieldGlint.fire()
        setShieldGlintFeed((f) => ({ count: f.count + 1, lastAt: Date.now() }))
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(shieldGlintTimeout.current)
  }, [shieldGlint])

  // ---- handlers ----
  const selectAnd = (setter, input) => (i) => { setter(i); if (input) input.value = i }
  const onHairVariant = selectAnd(setHairVariant, hairVariantsInput)
  const onHairColor = selectAnd(setHairColor, hairColorInput)
  const onSkin = selectAnd(setSkin, skinVariantsInput)
  const onEyeColor = selectAnd(setEyeColor, eyeColorInput)
  const onOutfitColor = selectAnd(setOutfitColor, outfitColorInput)

  const toggleSword = () => {
    const next = !swordVisible
    setSwordVisible(next)
    if (swordVisibleInput) swordVisibleInput.value = next
  }
  const toggleShield = () => {
    const next = !shieldVisible
    setShieldVisible(next)
    if (shieldVisibleInput) shieldVisibleInput.value = next
  }
  const onSwordCharge = (e) => {
    const v = Number(e.target.value)
    setSwordCharge(v)
    if (swordChargeInput) swordChargeInput.value = v
  }
  const onShieldCharge = (e) => {
    const v = Number(e.target.value)
    setShieldCharge(v)
    if (shieldChargeInput) shieldChargeInput.value = v
  }
  const toggleTalking = () => {
    const next = !isTalking
    setIsTalking(next)
    if (isTalkingInput) isTalkingInput.value = next
  }
  const toggleCelebrating = () => {
    const next = !isCelebrating
    setIsCelebrating(next)
    if (isCelebratingInput) isCelebratingInput.value = next
  }

  return (
    <>
      <div className="bg-glow">
        <div className="glow-ember" />
        <div className="glow-forest" />
        <div className="glow-lav" />
      </div>

      {/* ================= HERO — LIVE DEMO ================= */}
      <div className="layout-wrap">
        <div className="layout">
          <div className="stage">
            <div className="canvas-wrap">
              <RiveComponent />
            </div>
          </div>

          <div className="panel">
            <div className="top-tag">
              <span className="pulse" />
              Live State Machine
            </div>
            <h1>Adult Avatar Controller</h1>
            <p className="sub">UpSkillHero — Stage 3. Every control below is live on the canvas.</p>

            <div className="group-label">Customization</div>
            <div className="card">
              <OptionRow label="Hair Style" options={HAIR_VARIANTS} value={hairVariant} onChange={onHairVariant} />
              <OptionRow label="Hair Color" options={HAIR_COLORS} value={hairColor} onChange={onHairColor} />
              <OptionRow label="Skin" options={SKIN_VARIANTS} value={skin} onChange={onSkin} />
              <OptionRow label="Eye Color" options={EYE_COLORS} value={eyeColor} onChange={onEyeColor} />
              <OptionRow label="Outfit Color" options={OUTFIT_COLORS} value={outfitColor} onChange={onOutfitColor} />
            </div>

            <div className="group-label">Weapons</div>
            <div className="card">
              <div className="row">
                <div className="weapon-row-top">
                  <div className="label">Sword</div>
                  <Switch checked={swordVisible} onChange={toggleSword} />
                </div>
                <MiniSlider label="swordCharge" value={swordCharge} onChange={onSwordCharge} max={5} />
              </div>
              <div className="row">
                <div className="weapon-row-top">
                  <div className="label">Shield</div>
                  <Switch checked={shieldVisible} onChange={toggleShield} />
                </div>
                <MiniSlider label="shieldCharge" value={shieldCharge} onChange={onShieldCharge} max={5} />
              </div>
            </div>

            <div className="group-label">Effects (auto-firing + manual)</div>
            <div className="chip-row">
              <button className="chip-btn" onClick={() => blink?.fire()}><span className="chip-dot" />Blink</button>
              <button className="chip-btn" onClick={() => swordGlint?.fire()}><span className="chip-dot" />Sword Glint</button>
              <button className="chip-btn" onClick={() => shieldGlint?.fire()}><span className="chip-dot" />Shield Glint</button>
            </div>

            <div className="group-label">States</div>
            <div className="card">
              <div className="row weapon-row-top">
                <div className="label">isTalking</div>
                <Switch checked={isTalking} onChange={toggleTalking} />
              </div>
              <div className="row weapon-row-top">
                <div className="label">isCelebrating</div>
                <Switch checked={isCelebrating} onChange={toggleCelebrating} />
              </div>
            </div>

            <a className="scroll-cue" href="#docs">
              <span>Integration docs</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ================= DOCUMENTATION ================= */}
      <div id="docs" className="docs">
        <DocsNav />

        <div className="docs-body">

          <DocSection id="overview" eyebrow="Overview" title="UpSkillHero — Adult Avatar, Stage 3">
            <p>
              Driven by a single Rive <b>State Machine</b> —{' '}
              <code>Adult Avatar Controller</code> — with 14 inputs across
              customization, weapons, effects, and talk/celebrate states.
              This delivery is a bug-fix pass, not a scope change — no
              inputs were added, removed, or renamed.
            </p>
            <div className="badge-row">
              <span className="badge">JavaScript</span>
              <span className="badge">React Native</span>
              <span className="badge">Rive Runtime</span>
            </div>
          </DocSection>

          <DocSection id="fixed" eyebrow="This Update" title="Fixed — 3 confirmed bugs, no scope change">
            <p>
              Exactly the three items from the client's final revision
              request — nothing else changed.
            </p>
            <div className="fix-grid">
              <div className="fix-card">
                <div className="fix-card-title">Skin Color in Idle</div>
                <p>
                  <code>skinVariants</code> now updates the avatar
                  immediately in Idle. Previously it only visibly applied
                  after entering <code>isTalking</code>. Verified through
                  Idle → Talk → Idle — the selected skin persists correctly
                  across the transition.
                </p>
              </div>
              <div className="fix-card">
                <div className="fix-card-title">Shield Notch Color</div>
                <p>
                  One of the shield's charge notches was incorrectly
                  inheriting color from <code>outfitColor</code> for
                  certain values. The notch fill is now independent of
                  outfit color, matching the sword's behavior.
                </p>
              </div>
              <div className="fix-card">
                <div className="fix-card-title">Charge Fill UI</div>
                <p>
                  Reverted to the simple treatment the client asked to keep
                  — filled units are solid, empty notches are white. The
                  more elaborate charge-UI concept was not used this round,
                  per the client's direction to "keep things simple and in
                  line with what we've already done."
                </p>
              </div>
            </div>
          </DocSection>

          <DocSection id="customization" eyebrow="Customization" title="5 Number inputs">
            <div className="inputs-grid">
              <InputCard kind="Number 0–2" name="hairVariants" desc="0 Short/Spiky · 1 Side Hair · 2 Braids" />
              <InputCard kind="Number 0–4" name="hairColor" desc="0 Dark Brown · 1 Chestnut · 2 Auburn · 3 Orange/Red · 4 Blonde" />
              <InputCard kind="Number 0–4" name="skinVariants" desc="0 Palest → 4 Deep. Now updates live in Idle, not just during isTalking." />
              <InputCard kind="Number 0–4" name="eyeColor" desc="0 Dark Green · 1 Dark Brown · 2 Hazel · 3 Blue-Gray · 4 Amber/Gold" />
              <InputCard kind="Number 0–4" name="outfitColor" desc="0 Purple (base) · 1 Blue · 2 Green · 3 Red · 4 Gold" />
            </div>
          </DocSection>

          <DocSection id="weapons" eyebrow="Weapons" title="Equip + charge level">
            <div className="inputs-grid">
              <InputCard kind="Boolean" name="swordVisible" desc="Equip / unequip the sword." />
              <InputCard kind="Number 0–5" name="swordCharge" desc="Charge level — drives glow / notch fill." />
              <InputCard kind="Boolean" name="shieldVisible" desc="Equip / unequip the shield." />
              <InputCard kind="Number 0–5" name="shieldCharge" desc="Charge level — drives glow / notch fill. Notch color bug fixed this update." />
            </div>
            <p style={{ marginTop: 16 }}>
              Sword and shield currently keep their fixed artwork color
              regardless of <code>outfitColor</code> — weapon recoloring is
              out of this v1 scope ("Weapon Variants" listed as Not
              Included), flagged here pending a client decision.
            </p>
          </DocSection>

          <DocSection id="effects" eyebrow="Effects" title="One-shot triggers">
            <div className="inputs-grid">
              <InputCard kind="Trigger" name="Blink" desc="Single blink. Recommended: random 3–6s from app code." />
              <InputCard kind="Trigger" name="SwordGlint" desc="Short highlight flash on the sword. Recommended: random ~8–15s during Idle." />
              <InputCard kind="Trigger" name="ShieldGlint" desc="Same, for the shield." />
            </div>
            <div className="live-feed-stack">
              <LiveFeed label="Blink — live above" count={blinkFeed.count} lastAt={blinkFeed.lastAt} noun="blink" />
              <LiveFeed label="Sword Glint — live above" count={swordGlintFeed.count} lastAt={swordGlintFeed.lastAt} noun="glint" />
              <LiveFeed label="Shield Glint — live above" count={shieldGlintFeed.count} lastAt={shieldGlintFeed.lastAt} noun="glint" />
            </div>
          </DocSection>

          <DocSection id="states" eyebrow="States" title="isTalking / isCelebrating">
            <div className="inputs-grid">
              <InputCard kind="Boolean" name="isTalking" desc="true while the speech bubble is open/typewriting → plays Talk_Loop. false → returns to Idle." />
              <InputCard kind="Boolean" name="isCelebrating" desc="true on lesson complete / level-up / battle win → Celebrate_Burst then holds Celebrate_Loop. false → returns to Idle." />
            </div>
          </DocSection>

          <DocSection id="js" eyebrow="JavaScript" title="JavaScript example">
            <CodeBlock code={JS_EXAMPLE} />
          </DocSection>

          <DocSection id="rn" eyebrow="React Native" title="React Native example">
            <CodeBlock code={RN_EXAMPLE} />
          </DocSection>

          <DocSection id="auto-effects" eyebrow="Automatic Effects" title="Random blink + glints while idle">
            <p>Same pattern for all three — random interval, fire, repeat. Different cadence per effect.</p>
            <CodeBlock code={AUTO_EFFECTS_EXAMPLE} />
          </DocSection>

          <DocSection id="best-practices" eyebrow="Best Practices" title="Notes worth keeping in mind">
            <ul className="check-list">
              <li>Blink: random 3–6s. Glints: random 8–15s, ideally only during Idle.</li>
              <li>Set isTalking / isCelebrating false to return to Idle — there's no separate "stop" call.</li>
              <li>skinVariants applies immediately regardless of state — no need to route through isTalking anymore.</li>
              <li>Draw order: Shield/Sword use an "above target" Draw Order Rule, so they render above the body regardless of arm bone rotation — don't fight this with z-index-style workarounds on your side.</li>
              <li>All 3 hairstyles share one fill, so hairColor tints correctly no matter which hairVariants is active.</li>
            </ul>
          </DocSection>

          <DocSection id="checklist" eyebrow="Integration Checklist" title="Ship it">
            <ul className="check-list boxes">
              <li>Import the <code>.riv</code> file</li>
              <li>Load <code>Adult Avatar Controller</code></li>
              <li>Bind the 5 customization inputs</li>
              <li>Bind weapon visibility + charge (×2)</li>
              <li>Schedule Blink (3–6s) and both Glints (8–15s)</li>
              <li>Wire isTalking to the speech bubble open/close</li>
              <li>Wire isCelebrating to lesson-complete / level-up / battle-win</li>
              <li>Confirm skin color now updates live in Idle</li>
              <li>Confirm shield notch color is correct across all outfit colors</li>
              <li>Done</li>
            </ul>
          </DocSection>

          <footer className="docs-footer">
            Adult Avatar Controller · UpSkillHero · Rive integration docs
          </footer>
        </div>
      </div>
    </>
  )
}

function OptionRow({ label, options, value, onChange }) {
  return (
    <div className="row">
      <div className="label" style={{ marginBottom: 9 }}>{label}</div>
      <div className="opt-row">
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            className={`opt-pill${value === i ? ' active' : ''}`}
            onClick={() => onChange(i)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function MiniSlider({ label, value, onChange, max }) {
  return (
    <div className="mini-slider">
      <input type="range" min={0} max={max} step={1} value={value} onChange={onChange} className="slider" />
      <span className="value-pill">{value}</span>
    </div>
  )
}

function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="track" />
      <span className="thumb" />
    </label>
  )
}

function DocsNav() {
  const items = [
    ['overview', 'Overview'],
    ['fixed', 'This Update'],
    ['customization', 'Customization'],
    ['weapons', 'Weapons'],
    ['effects', 'Effects'],
    ['states', 'States'],
    ['js', 'JavaScript'],
    ['rn', 'React Native'],
    ['auto-effects', 'Auto Effects'],
    ['best-practices', 'Best Practices'],
    ['checklist', 'Checklist'],
  ]
  return (
    <nav className="docs-nav">
      {items.map(([id, label]) => (
        <a key={id} href={`#${id}`}>{label}</a>
      ))}
    </nav>
  )
}

function DocSection({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="doc-section">
      <div className="doc-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function InputCard({ kind, name, desc }) {
  return (
    <div className="input-card">
      <div className="input-kind">{kind}</div>
      <code>{name}</code>
      <p>{desc}</p>
    </div>
  )
}

function LiveFeed({ label, count, lastAt, noun }) {
  const [, forceTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const secondsAgo = lastAt ? Math.max(0, Math.round((Date.now() - lastAt) / 1000)) : null
  return (
    <div className="live-feed">
      <span className="live-feed-dot" />
      <span className="live-feed-label">{label}</span>
      <span className="live-feed-value">
        {count === 0 ? `waiting for first ${noun}…` : `${count} fired · last ${secondsAgo}s ago`}
      </span>
    </div>
  )
}

function CodeBlock({ code }) {
  return <pre className="code-block"><code>{code}</code></pre>
}

const JS_EXAMPLE = `import { Rive, Fit, Alignment, Layout } from '@rive-app/canvas'

const r = new Rive({
  src: 'adult-avatar.riv',
  canvas: document.getElementById('avatar-canvas'),
  autoplay: true,
  stateMachines: 'Adult Avatar Controller',
  layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  onLoad: () => {
    const inputs = r.stateMachineInputs('Adult Avatar Controller')
    const isTalking = inputs.find(i => i.name === 'isTalking')
    const hairVariants = inputs.find(i => i.name === 'hairVariants')
    const swordVisible = inputs.find(i => i.name === 'swordVisible')
    const swordCharge = inputs.find(i => i.name === 'swordCharge')

    isTalking.value = true
    hairVariants.value = 2   // Braids
    swordVisible.value = true
    swordCharge.value = 3
  },
})`

const RN_EXAMPLE = `import Rive from 'rive-react-native'

const SM = 'Adult Avatar Controller'

export function AdultAvatar() {
  const riveRef = useRef(null)

  const set = (name, value) => riveRef.current?.setInputState(SM, name, value)
  const fire = (name) => riveRef.current?.fireState(SM, name)

  const equipSword = () => set('swordVisible', true)
  const startTalking = () => set('isTalking', true)
  const celebrate = () => set('isCelebrating', true)
  const blink = () => fire('Blink')

  return (
    <Rive
      ref={riveRef}
      resourceName="adult_avatar"
      stateMachineName={SM}
      autoplay
      style={{ width: '100%', height: 360 }}
    />
  )
}`

const AUTO_EFFECTS_EXAMPLE = `function scheduleBlink(blink) {
  const next = 3000 + Math.random() * 3000 // 3–6s
  setTimeout(() => { blink?.fire(); scheduleBlink(blink) }, next)
}

function scheduleGlint(glint) {
  const next = 8000 + Math.random() * 7000 // 8–15s
  setTimeout(() => { glint?.fire(); scheduleGlint(glint) }, next)
}

scheduleBlink(blink)
scheduleGlint(swordGlint)
scheduleGlint(shieldGlint)`
