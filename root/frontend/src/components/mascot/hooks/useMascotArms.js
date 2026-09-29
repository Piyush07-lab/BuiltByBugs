import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ARM_STATES,
  ARM_CONFIGS,
  ARM_ACTIONS,
  computeArmEndpoint,
} from '../utils/armKinematics';

/**
 * Custom hook to control Mascot arm movements across the 4 discrete states
 * with 3D (X, Y, Z) point-to-point positioning and action routines (waving, t-pose, cheer, etc.)
 */
export function useMascotArms({
  isCurious = false,
  isDraggingState = false,
  isEasterEgg = false,
  externalAction = null,
} = {}) {
  // Current discrete states for left and right arm [1, 2, 3, 4]
  const [armStates, setArmStates] = useState({
    left: ARM_STATES.LOWERED,
    right: ARM_STATES.LOWERED,
  });

  const [activeAction, setActiveAction] = useState('idle');
  const timerRef = useRef(null);
  const frameIndexRef = useRef(0);
  const currentActionRef = useRef('idle');

  // Trigger an action sequence (e.g. 'wave', 'cheer', 'tpose')
  const triggerAction = useCallback((actionName, onComplete) => {
    const action = ARM_ACTIONS[actionName];
    if (!action || !action.frames || action.frames.length === 0) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    currentActionRef.current = actionName;
    frameIndexRef.current = 0;

    const playFrame = (idx) => {
      if (idx >= action.frames.length) {
        if (action.loop) {
          frameIndexRef.current = 0;
          playFrame(0);
        } else {
          currentActionRef.current = 'idle';
          setActiveAction('idle');
          setArmStates({ left: ARM_STATES.LOWERED, right: ARM_STATES.LOWERED });
          if (onComplete) onComplete();
        }
        return;
      }

      const frame = action.frames[idx];
      setArmStates({
        left: frame.left ?? ARM_STATES.LOWERED,
        right: frame.right ?? ARM_STATES.LOWERED,
      });

      timerRef.current = setTimeout(() => {
        frameIndexRef.current = idx + 1;
        playFrame(idx + 1);
      }, frame.duration || 250);
    };

    timerRef.current = setTimeout(() => {
      setActiveAction(actionName);
      playFrame(0);
    }, 0);
  }, []);

  // Directly set discrete arm states (1, 2, 3, 4)
  const setDirectArmState = useCallback((newStates) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    currentActionRef.current = 'custom';
    setActiveAction('custom');
    setArmStates((prev) => ({
      left: newStates.left ?? prev.left,
      right: newStates.right ?? prev.right,
    }));
  }, []);

  // External Action override
  useEffect(() => {
    if (externalAction && ARM_ACTIONS[externalAction]) {
      triggerAction(externalAction);
    }
  }, [externalAction, triggerAction]);

  // Contextual Trigger: Dragging Mascot (Hands up / fluttering)
  useEffect(() => {
    if (isDraggingState) {
      triggerAction('handsUp');
    } else if (currentActionRef.current === 'handsUp') {
      triggerAction('idle');
    }
  }, [isDraggingState, triggerAction]);

  // Contextual Trigger: Curious state (raises one arm)
  useEffect(() => {
    if (isCurious && !isDraggingState && currentActionRef.current === 'idle') {
      triggerAction('curious');
    } else if (!isCurious && currentActionRef.current === 'curious') {
      triggerAction('idle');
    }
  }, [isCurious, isDraggingState, triggerAction]);

  // Contextual Trigger: Easter Egg (Celebration cheer)
  useEffect(() => {
    if (isEasterEgg && !isDraggingState) {
      triggerAction('cheer');
    }
  }, [isEasterEgg, isDraggingState, triggerAction]);

  // Periodic subtle idle wave (every ~18s) to keep bot alive
  useEffect(() => {
    const idleWaveInterval = setInterval(() => {
      if (
        currentActionRef.current === 'idle' &&
        !isDraggingState &&
        !isCurious &&
        !isEasterEgg
      ) {
        triggerAction('wave');
      }
    }, 18000);

    return () => clearInterval(idleWaveInterval);
  }, [isDraggingState, isCurious, isEasterEgg, triggerAction]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Compute 3D rotation transforms from current states
  const leftTransform = useMemo(() => {
    const state = armStates.left;
    return ARM_CONFIGS[state]?.left || ARM_CONFIGS[1].left;
  }, [armStates.left]);

  const rightTransform = useMemo(() => {
    const state = armStates.right;
    return ARM_CONFIGS[state]?.right || ARM_CONFIGS[1].right;
  }, [armStates.right]);

  // Compute endpoints along the curve for physics/debug
  const leftEndpoint = useMemo(() => {
    return computeArmEndpoint('left', armStates.left);
  }, [armStates.left]);

  const rightEndpoint = useMemo(() => {
    return computeArmEndpoint('right', armStates.right);
  }, [armStates.right]);

  return {
    armStates,
    leftTransform,
    rightTransform,
    leftEndpoint,
    rightEndpoint,
    activeAction,
    triggerAction,
    setArmState: setDirectArmState,
  };
}
