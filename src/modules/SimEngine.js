// SimEngine.js — pure ODE solvers (no React)

// ── RK4 integrator ──────────────────────────────────────────
function rk4(f, y, t, dt) {
  const k1 = f(t,        y)
  const k2 = f(t + dt/2, y.map((v,i) => v + k1[i]*dt/2))
  const k3 = f(t + dt/2, y.map((v,i) => v + k2[i]*dt/2))
  const k4 = f(t + dt,   y.map((v,i) => v + k3[i]*dt))
  return y.map((v,i) => v + (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) * dt / 6)
}

// ── PANDEMIC  (SEIR) ─────────────────────────────────────────
export function runPandemic(p, steps = 300, dt = 0.5) {
  const { beta, gamma, sigma, N, I0 } = p
  const E0 = I0 * 0.5
  let [S, E, I, R] = [N - E0 - I0, E0, I0, 0]
  const series = { S: [S], E: [E], I: [I], R: [R], t: [0] }

  const f = (_t, [S, E, I, R]) => {
    const dS = -beta * S * I / N
    const dE =  beta * S * I / N - sigma * E
    const dI =  sigma * E - gamma * I
    const dR =  gamma * I
    return [dS, dE, dI, dR]
  }

  for (let i = 0; i < steps; i++) {
    const next = rk4(f, [S, E, I, R], i * dt, dt)
    ;[S, E, I, R] = next.map(v => Math.max(0, v))
    series.S.push(S); series.E.push(E); series.I.push(I); series.R.push(R)
    series.t.push((i + 1) * dt)
  }
  return series
}

// ── ECOSYSTEM  (Lotka-Volterra + logistic) ───────────────────
export function runEcosystem(p, steps = 400, dt = 0.1) {
  const { alpha, beta, delta, gamma, K } = p
  let prey = K * 0.4, pred = K * 0.08
  const series = { prey: [prey], pred: [pred], t: [0] }

  const f = (_t, [x, y]) => {
    const dx = alpha * x * (1 - x / K) - beta * x * y
    const dy = delta * x * y - gamma * y
    return [dx, dy]
  }

  for (let i = 0; i < steps; i++) {
    const next = rk4(f, [prey, pred], i * dt, dt)
    ;[prey, pred] = next.map(v => Math.max(0, v))
    series.prey.push(prey); series.pred.push(pred)
    series.t.push((i + 1) * dt)
  }
  return series
}

// ── EVOLUTION  (Wright-Fisher + selection) ───────────────────
export function runEvolution(p, steps = 200) {
  const { s, h, Ne, mu, q0 } = p
  let q = q0
  const series = { q: [q], qDet: [q], t: [0] }

  for (let i = 0; i < steps; i++) {
    const w   = 1 + 2*h*s*q*(1-q) + s*q*q
    const q1  = Math.max(0, Math.min(1, q * (1 + s*q + h*s*(1-q)) / w + mu))
    // stochastic drift via normal approx
    const sigma = Math.sqrt(q1 * (1 - q1) / (2 * Ne))
    // Box-Muller
    const u1 = Math.random(), u2 = Math.random()
    const z  = Math.sqrt(-2*Math.log(u1||1e-9)) * Math.cos(2*Math.PI*u2)
    q = Math.max(0, Math.min(1, q1 + sigma * z))
    series.q.push(q)
    series.qDet.push(q1)
    series.t.push(i + 1)
  }
  return series
}
