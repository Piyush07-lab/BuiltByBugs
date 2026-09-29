/**
 * Arm Kinematics & Point-to-Point Motion Engine for MascotBot
 *
 * Simulates shoulder origin joint 'o' to arm endpoint 'e' as a radius line (R = 28px).
 * Supports 3D rotation in X, Y, and Z axis across 4 discrete physical states:
 * - State 1: Lowered (resting position alongside body)
 * - State 2: T-Pose (horizontal outward 90°)
 * - State 3: Mid-Way Up (diagonal upward-outward ~135°)
 * - State 4: 180 Degree Upward (pointing straight up into the air)
 *
 * Predefined actions sequence these 4 states (e.g. Waving: State 3 <-> State 4).
 */

export const SHOULDER_JOINTS = {
  left: { x: 31, y: 60, z: 0 },
  right: { x: 89, y: 60, z: 0 },
};

export const ARM_RADIUS = 28; // Distance from origin O to endpoint E

export const ARM_STATES = {
  LOWERED: 1, // State 1: Resting downward
  T_POSE: 2, // State 2: Horizontal 90° outward
  MID_UP: 3, // State 3: Mid-way up (~135° diagonal)
  UPWARD_180: 4, // State 4: 180° straight upward
};

/**
 * 3D Angular Orientation (rotZ, rotX, rotY in degrees) for each canonical state.
 * Rotation around shoulder joint origin 'o':
 * - rotZ: In-plane rotation (elevation / lowering along the 2D curve)
 * - rotX: Pitch angle (reaching forward/backward in 3D depth)
 * - rotY: Yaw angle (twisting toward/away from the viewer)
 */
export const ARM_CONFIGS = {
  // State 1: Lowered
  1: {
    left: { rotZ: 0, rotX: 0, rotY: 0 },
    right: { rotZ: 0, rotX: 0, rotY: 0 },
  },
  // State 2: T-Pose (horizontal 90° outward)
  2: {
    left: { rotZ: 90, rotX: 6, rotY: 10 },
    right: { rotZ: -90, rotX: 6, rotY: -10 },
  },
  // State 3: Mid-Way Up (diagonal ~135° upward-outward)
  3: {
    left: { rotZ: 135, rotX: 14, rotY: 16 },
    right: { rotZ: -135, rotX: 14, rotY: -16 },
  },
  // State 4: 180° Upward (straight up in the air)
  4: {
    left: { rotZ: 180, rotX: 8, rotY: 2 },
    right: { rotZ: -180, rotX: 8, rotY: -2 },
  },
};

/**
 * Computes the 3D endpoint coordinate E on the curved radius sphere
 * from origin joint O given the state.
 *
 * @param {'left' | 'right'} side
 * @param {1 | 2 | 3 | 4} state
 * @returns {{
 *   origin: {x: number, y: number, z: number},
 *   radius: number,
 *   endpoint: {x: number, y: number, z: number},
 *   angles: {rotZ: number, rotX: number, rotY: number}
 * }}
 */
export function computeArmEndpoint(side, state = 1) {
  const origin = SHOULDER_JOINTS[side] || SHOULDER_JOINTS.left;
  const validState = ARM_CONFIGS[state] ? state : 1;
  const angles = ARM_CONFIGS[validState][side];

  const radZ = (angles.rotZ * Math.PI) / 180;
  const radX = (angles.rotX * Math.PI) / 180;
  const radY = (angles.rotY * Math.PI) / 180;

  // In default resting state (1), vector points downward along +Y
  const initX = side === 'left' ? -3 : 3;
  const initY = ARM_RADIUS;
  const initZ = 0;

  // 1. Rotate around Z (elevation in plane)
  const x1 = initX * Math.cos(radZ) - initY * Math.sin(radZ);
  const y1 = initX * Math.sin(radZ) + initY * Math.cos(radZ);
  const z1 = initZ;

  // 2. Rotate around X (pitch)
  const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
  const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);
  const x2 = x1;

  // 3. Rotate around Y (yaw)
  const x3 = x2 * Math.cos(radY) + z2 * Math.sin(radY);
  const z3 = -x2 * Math.sin(radY) + z2 * Math.cos(radY);
  const y3 = y2;

  return {
    origin,
    radius: ARM_RADIUS,
    endpoint: {
      x: origin.x + x3,
      y: origin.y + y3,
      z: origin.z + z3,
    },
    angles,
  };
}

/**
 * Action definitions: sequences of discrete arm state poses.
 * Frames define target state for left and right arms and duration in ms.
 */
export const ARM_ACTIONS = {
  idle: {
    name: 'idle',
    frames: [{ left: 1, right: 1, duration: 1000 }],
    loop: true,
  },
  // Active Waving: Cycles State 3 (mid-way up) <-> State 4 (180° upward)
  wave: {
    name: 'wave',
    frames: [
      { left: 1, right: 3, duration: 220 },
      { left: 1, right: 4, duration: 220 },
      { left: 1, right: 3, duration: 220 },
      { left: 1, right: 4, duration: 220 },
      { left: 1, right: 3, duration: 220 },
      { left: 1, right: 1, duration: 260 },
    ],
    loop: false,
  },
  'wave-loop': {
    name: 'wave-loop',
    frames: [
      { left: 1, right: 3, duration: 220 },
      { left: 1, right: 4, duration: 220 },
    ],
    loop: true,
  },
  'double-wave': {
    name: 'double-wave',
    frames: [
      { left: 3, right: 3, duration: 220 },
      { left: 4, right: 4, duration: 220 },
      { left: 3, right: 3, duration: 220 },
      { left: 4, right: 4, duration: 220 },
      { left: 1, right: 1, duration: 280 },
    ],
    loop: false,
  },
  tpose: {
    name: 'tpose',
    frames: [{ left: 2, right: 2, duration: 1200 }],
    loop: true,
  },
  cheer: {
    name: 'cheer',
    frames: [
      { left: 4, right: 4, duration: 320 },
      { left: 3, right: 3, duration: 200 },
      { left: 4, right: 4, duration: 320 },
      { left: 1, right: 1, duration: 280 },
    ],
    loop: false,
  },
  curious: {
    name: 'curious',
    frames: [{ left: 1, right: 3, duration: 700 }],
    loop: false,
  },
  shrug: {
    name: 'shrug',
    frames: [
      { left: 2, right: 2, duration: 450 },
      { left: 1, right: 1, duration: 250 },
    ],
    loop: false,
  },
  handsUp: {
    name: 'handsUp',
    frames: [{ left: 4, right: 4, duration: 1000 }],
    loop: true,
  },
};
