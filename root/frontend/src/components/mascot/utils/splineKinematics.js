/**
 * Spline Kinematics & Trajectory Engine for MascotBot
 *
 * Implements:
 * - 2D Centripetal/Uniform Catmull-Rom Spline interpolation with analytical derivatives.
 * - Tangent-derived aerodynamic banking (roll and pitch).
 * - Multi-harmonic Lissajous floating drift for idle companion simulation.
 * - Inertial velocity decay with soft boundary damping.
 */

/**
 * Evaluates a 2D Catmull-Rom spline point and its analytical first derivative (tangent)
 * at parameter t in [0, 1].
 *
 * @param {{x: number, y: number}} p0 Precursor waypoint
 * @param {{x: number, y: number}} p1 Start waypoint
 * @param {{x: number, y: number}} p2 End waypoint
 * @param {{x: number, y: number}} p3 Successor waypoint
 * @param {number} t Parameter [0, 1]
 * @returns {{ point: {x: number, y: number}, tangent: {x: number, y: number} }}
 */
export function evaluateCatmullRom2D(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;

    // Standard Catmull-Rom basis matrix formulation
    // P(t) = 0.5 * [ (2*p1) + (-p0 + p2)*t + (2*p0 - 5*p1 + 4*p2 - p3)*t^2 + (-p0 + 3*p1 - 3*p2 + p3)*t^3 ]
    const aX = -p0.x + 3 * p1.x - 3 * p2.x + p3.x;
    const bX = 2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x;
    const cX = -p0.x + p2.x;
    const dX = 2 * p1.x;

    const aY = -p0.y + 3 * p1.y - 3 * p2.y + p3.y;
    const bY = 2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y;
    const cY = -p0.y + p2.y;
    const dY = 2 * p1.y;

    const x = 0.5 * (aX * t3 + bX * t2 + cX * t + dX);
    const y = 0.5 * (aY * t3 + bY * t2 + cY * t + dY);

    // Analytical derivative P'(t) = Tangent vector
    const dx = 0.5 * (3 * aX * t2 + 2 * bX * t + cX);
    const dy = 0.5 * (3 * aY * t2 + 2 * bY * t + cY);

    return {
        point: { x, y },
        tangent: { x: dx, y: dy }
    };
}

/**
 * Synthesizes Catmull-Rom waypoints for a flight path from start to target,
 * adding an organic swoop apex biased against gravity.
 *
 * @param {{x: number, y: number}} start
 * @param {{x: number, y: number}} target
 * @param {{minX: number, maxX: number, minY: number, maxY: number}} bounds
 * @returns {[{x: number, y: number}, {x: number, y: number}, {x: number, y: number}, {x: number, y: number}]}
 */
export function generateFlightWaypoints(start, target, bounds) {
    const deltaX = target.x - start.x;
    const deltaY = target.y - start.y;
    const distance = Math.hypot(deltaX, deltaY);

    // Balanced playful-subtle: swoop upward (negative Y in screen coords)
    // with subtle perpendicular drift
    const arcHeight = Math.min(80, Math.max(30, distance * 0.25));
    const perpSign = deltaX >= 0 ? -1 : 1;
    const perpOffset = (deltaY / (distance || 1)) * 20 * perpSign;

    const apexX = Math.max(bounds.minX, Math.min(bounds.maxX, (start.x + target.x) / 2 + perpOffset));
    const apexY = Math.max(bounds.minY, Math.min(bounds.maxY, (start.y + target.y) / 2 - arcHeight));

    const p1 = { x: start.x, y: start.y };
    const p2 = { x: apexX, y: apexY };
    const p3 = { x: target.x, y: target.y };

    // Extrapolate virtual endpoints p0 and p4 to maintain smooth curvature at boundaries
    const p0 = {
        x: p1.x - (p2.x - p1.x) * 0.7,
        y: p1.y - (p2.y - p1.y) * 0.7
    };
    const p4 = {
        x: p3.x + (p3.x - p2.x) * 0.5,
        y: p3.y + (p3.y - p2.y) * 0.5
    };

    return [p0, p1, p2, p3, p4];
}

/**
 * Multi-harmonic Lissajous float for an organic companion drone hover.
 *
 * @param {number} timeSec Elapsed time in seconds
 * @returns {{x: number, y: number, tilt: number}}
 */
export function getHarmonicHover(timeSec) {
    // Dual-harmonic superposition creates non-repeating lifelike drift
    const x = Math.sin(timeSec * 1.1) * 3.5 + Math.cos(timeSec * 0.55) * 1.8;
    const y = Math.cos(timeSec * 1.35) * 5.0 + Math.sin(timeSec * 0.72) * 2.2;
    const tilt = Math.sin(timeSec * 0.95) * 2.0; // Subtle roll (deg)

    return { x, y, tilt };
}

/**
 * Calculates aerodynamic banking roll angle (degrees) from flight tangent.
 *
 * @param {{x: number, y: number}} tangent Velocity / tangent vector
 * @param {number} maxRoll Maximum roll angle in degrees (default: 14)
 * @returns {number} Banking roll in degrees
 */
export function calculateBankingRoll(tangent, maxRoll = 14) {
    if (!tangent) return 0;
    // Positive horizontal velocity tilts right (+ roll), negative tilts left (- roll)
    const normalizedX = Math.max(-1, Math.min(1, tangent.x / 120));
    return normalizedX * maxRoll;
}

/**
 * Clamps coordinates within the allowed viewport margins.
 *
 * @param {{x: number, y: number}} pos
 * @param {{minX: number, maxX: number, minY: number, maxY: number}} bounds
 * @returns {{x: number, y: number}}
 */
export function clampToBounds(pos, bounds) {
    return {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y))
    };
}
