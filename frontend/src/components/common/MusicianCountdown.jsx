import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  buildMusicianCountdownItems,
  COUNTDOWN_ROTATION_MS,
  getCountdownParts
} from '@utils/musicianCountdown';

gsap.registerPlugin(useGSAP);

const CountdownBlock = ({ value, label, isDark, variant }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: variant === 'desktop' ? '6px 12px' : '5px 11px'
    }}
  >
    <span
      style={{
        fontSize: variant === 'desktop' ? '20px' : '18px',
        fontWeight: '800',
        lineHeight: 1,
        color: isDark ? '#D4AF37' : '#8B6914',
        fontVariantNumeric: 'tabular-nums'
      }}
    >
      {String(value).padStart(2, '0')}
    </span>
    <span
      style={{
        fontSize: '7px',
        fontWeight: '600',
        letterSpacing: '0.9px',
        color: isDark ? 'rgba(212,175,55,0.55)' : 'rgba(139,105,20,0.7)',
        marginTop: '3px',
        textTransform: 'uppercase'
      }}
    >
      {label}
    </span>
  </div>
);

const BlockDivider = ({ isDark, variant }) => (
  <div
    style={{
      width: '1px',
      alignSelf: 'stretch',
      background: isDark ? 'rgba(212,175,55,0.2)' : 'rgba(139,105,20,0.25)',
      margin: variant === 'desktop' ? '6px 0' : '5px 0'
    }}
  />
);

const pillStyle = (isDark) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '14px',
  background: isDark
    ? 'linear-gradient(135deg, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.06) 100%)'
    : 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.08) 100%)',
  border: `1px solid ${isDark ? 'rgba(212,175,55,0.25)' : 'rgba(139,105,20,0.35)'}`,
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  boxShadow: isDark
    ? '0 4px 16px rgba(212,175,55,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
    : '0 4px 16px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
  overflow: 'hidden'
});

const measurementWrapperStyle = {
  position: 'absolute',
  left: '-9999px',
  top: 0,
  visibility: 'hidden',
  pointerEvents: 'none'
};

const getReducedMotionPreference = () => (
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

const getCountdownTitle = (item) => {
  if (item.type === 'rehearsal') {
    const targetDate = new Date(item.date);
    const now = new Date();
    const isSameDay = targetDate.getFullYear() === now.getFullYear()
      && targetDate.getMonth() === now.getMonth()
      && targetDate.getDate() === now.getDate();

    return isSameDay ? 'Hoje' : item.name;
  }

  return item.name;
};

const renderCountdownBlocks = (countdown, isDark, variant) => {
  if (countdown.days > 0) {
    return (
      <>
        <CountdownBlock value={countdown.days} label="Dias" isDark={isDark} variant={variant} />
        <BlockDivider isDark={isDark} variant={variant} />
        <CountdownBlock value={countdown.hours} label="Horas" isDark={isDark} variant={variant} />
        <BlockDivider isDark={isDark} variant={variant} />
        <CountdownBlock value={countdown.minutes} label="Min" isDark={isDark} variant={variant} />
      </>
    );
  }

  return (
    <>
      <CountdownBlock value={countdown.hours} label="Horas" isDark={isDark} variant={variant} />
      <BlockDivider isDark={isDark} variant={variant} />
      <CountdownBlock value={countdown.minutes} label="Min" isDark={isDark} variant={variant} />
      <BlockDivider isDark={isDark} variant={variant} />
      <CountdownBlock value={countdown.seconds} label="Seg" isDark={isDark} variant={variant} />
    </>
  );
};

const modeLabelStyle = (isDark, variant) => ({
  display: 'inline-block',
  background: variant === 'desktop'
    ? 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.1) 100%)'
    : '#D4AF37',
  border: variant === 'desktop' ? '1px solid rgba(212,175,55,0.35)' : 'none',
  backdropFilter: variant === 'desktop' ? 'blur(12px)' : undefined,
  WebkitBackdropFilter: variant === 'desktop' ? 'blur(12px)' : undefined,
  color: variant === 'desktop' ? (isDark ? '#D4AF37' : '#8B6914') : '#3D1518',
  fontSize: '10px',
  fontWeight: '700',
  padding: variant === 'desktop' ? '6px 14px' : '5px 10px',
  borderRadius: variant === 'desktop' ? '10px' : '8px',
  textTransform: 'uppercase',
  letterSpacing: variant === 'desktop' ? '0.8px' : '0.5px'
});

const CountdownSurface = ({
  item,
  countdown,
  isDark,
  variant,
  layerRef,
  measurementId,
  isOverlay = false
}) => {
  const mutedColor = isDark ? 'var(--text-muted)' : 'rgba(0,0,0,0.45)';
  const goldLabel = isDark ? '#D4AF37' : '#8B6914';
  const title = getCountdownTitle(item);
  const contentAlignment = variant === 'mobile' ? 'flex-start' : 'center';
  const textAlignment = variant === 'mobile' ? 'left' : 'center';

  return (
    <div
      ref={layerRef}
      data-countdown-measure-id={measurementId}
      data-countdown-kind={item.type}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: contentAlignment,
        width: '100%',
        ...(isOverlay
          ? {
            position: 'absolute',
            inset: 0,
            justifyContent: 'flex-start',
            willChange: 'transform, opacity, filter'
          }
          : {})
      }}
    >
      <p
        data-countdown-slot="eyebrow"
        style={{
          fontSize: variant === 'desktop' ? '8px' : '9px',
          fontWeight: '700',
          letterSpacing: variant === 'desktop' ? '1.1px' : '1.2px',
          textTransform: 'uppercase',
          color: mutedColor,
          margin: 0,
          lineHeight: 1.4
        }}
      >
        {item.label}
      </p>
      <p
        data-countdown-slot="title"
        style={{
          fontSize: item.type === 'presentation'
            ? (variant === 'desktop' ? '11px' : '14px')
            : '12px',
          fontWeight: '800',
          letterSpacing: '0.3px',
          textTransform: 'uppercase',
          color: goldLabel,
          margin: variant === 'desktop' ? '1px 0 4px' : '1px 0 6px',
          lineHeight: 1.3,
          textAlign: textAlignment,
          maxWidth: variant === 'desktop' ? '220px' : '240px'
        }}
      >
        {title}
      </p>
      <p
        data-countdown-slot="meta"
        style={{
          fontSize: variant === 'desktop' ? '8px' : '9px',
          fontWeight: variant === 'desktop' ? '600' : '700',
          letterSpacing: variant === 'desktop' ? '1px' : '1.2px',
          textTransform: 'uppercase',
          color: mutedColor,
          margin: `0 0 ${variant === 'desktop' ? '6px' : '8px'}`,
          lineHeight: 1.4
        }}
      >
        Iniciando em
      </p>
      <div data-countdown-slot="pill" style={pillStyle(isDark)}>
        {renderCountdownBlocks(countdown, isDark, variant)}
      </div>
    </div>
  );
};

const MusicianCountdown = ({
  diasEnsaio,
  repertorioAtivo,
  modoRecesso,
  isDark,
  variant = 'mobile'
}) => {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingItem, setExitingItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const horizontalAlignment = variant === 'mobile' ? 'flex-start' : 'center';

  const rootRef = useRef(null);
  const activeLayerRef = useRef(null);
  const exitingLayerRef = useRef(null);
  const measurementRefs = useRef(new Map());
  const reducedMotion = getReducedMotionPreference();

  const { items, rehearsalInfo } = useMemo(
    () => buildMusicianCountdownItems(diasEnsaio, repertorioAtivo),
    [diasEnsaio, repertorioAtivo]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const countdownsById = items.reduce((accumulator, item) => {
    accumulator[item.id] = getCountdownParts(item.date, currentTime);
    return accumulator;
  }, {});

  const layoutSignature = useMemo(() => (
    items
      .map((item) => {
        const countdown = countdownsById[item.id] ?? { days: 0 };
        return `${item.id}:${countdown.days > 0 ? 'days' : 'short'}`;
      })
      .join('|')
  ), [countdownsById, items]);

  const rotationSignature = items.map((item) => `${item.id}:${item.name}`).join('|');
  useEffect(() => {
    setActiveIndex(0);
    setExitingItem(null);
    setIsPaused(false);
  }, [rotationSignature]);

  useEffect(() => {
    if (items.length < 2) {
      setStageSize({ width: 0, height: 0 });
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      let nextHeight = 0;
      let nextWidth = 0;

      measurementRefs.current.forEach((node) => {
        if (!node) return;
        nextHeight = Math.max(nextHeight, Math.ceil(node.offsetHeight || 0));
        nextWidth = Math.max(nextWidth, Math.ceil(node.offsetWidth || 0));
      });

      setStageSize((currentSize) => (
        currentSize.height === nextHeight && currentSize.width === nextWidth
          ? currentSize
          : { width: nextWidth, height: nextHeight }
      ));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [items.length, layoutSignature, rotationSignature]);

  const shouldRotate = items.length > 1;
  useEffect(() => {
    if (!shouldRotate || isPaused) {
      return undefined;
    }

    const rotationId = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const currentItem = items[currentIndex] ?? items[0];
        const nextIndex = (currentIndex + 1) % items.length;

        setExitingItem(reducedMotion ? null : currentItem);
        return nextIndex;
      });
    }, COUNTDOWN_ROTATION_MS);

    return () => clearInterval(rotationId);
  }, [isPaused, items, reducedMotion, shouldRotate]);

  const activeItem = items[activeIndex] ?? items[0];
  const activeCountdown = activeItem ? countdownsById[activeItem.id] : null;
  const exitingCountdown = exitingItem ? countdownsById[exitingItem.id] : null;

  useGSAP((context, contextSafe) => {
    const activeLayer = activeLayerRef.current;
    const activeSlots = activeLayer?.querySelectorAll('[data-countdown-slot]') ?? [];
    const leavingLayer = exitingLayerRef.current;
    const leavingSlots = leavingLayer?.querySelectorAll('[data-countdown-slot]') ?? [];

    if (!activeLayer) {
      return;
    }

    if (reducedMotion || !leavingLayer || leavingSlots.length === 0) {
      gsap.set(activeLayer, { autoAlpha: 1, y: 0, scale: 1, clearProps: 'filter' });
      gsap.set(activeSlots, { autoAlpha: 1, y: 0, clearProps: 'filter' });
      return;
    }

    const finishTransition = contextSafe(() => {
      setExitingItem(null);
    });

    gsap.set(activeLayer, { autoAlpha: 1, y: 0, scale: 1 });
    gsap.set(activeSlots, { autoAlpha: 0, y: 14, filter: 'blur(6px)' });
    gsap.set(leavingLayer, { autoAlpha: 1, y: 0, scale: 1 });
    gsap.set(leavingSlots, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: finishTransition
    });

    timeline.to(leavingSlots, {
      autoAlpha: 0,
      y: -12,
      filter: 'blur(6px)',
      duration: 0.2,
      stagger: 0.022,
      ease: 'power2.in'
    }, 0);

    timeline.to(leavingLayer, {
      autoAlpha: 0,
      duration: 0.22,
      ease: 'none'
    }, 0);

    timeline.to(activeSlots, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.34,
      stagger: 0.03,
      ease: 'power2.out',
      clearProps: 'filter'
    }, 0.08);
  }, {
    scope: rootRef,
    dependencies: [activeItem?.id, exitingItem?.id, reducedMotion],
    revertOnUpdate: true
  });

  const setMeasurementRef = (id) => (node) => {
    if (node) {
      measurementRefs.current.set(id, node);
      return;
    }

    measurementRefs.current.delete(id);
  };

  if (modoRecesso) {
    return (
      <div style={variant === 'mobile' ? { marginTop: '8px' } : undefined}>
        <div style={modeLabelStyle(isDark, variant)}>EM RECESSO</div>
      </div>
    );
  }

  if (rehearsalInfo.isNow) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: variant === 'mobile' ? '8px' : undefined
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#22C55E',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        <span
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#22C55E',
            whiteSpace: variant === 'desktop' ? 'nowrap' : undefined
          }}
        >
          {variant === 'desktop' ? 'Ensaio agora!' : 'Ensaio acontecendo agora!'}
        </span>
      </div>
    );
  }

  if (!activeItem || !activeCountdown) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      data-testid="musician-countdown"
      onMouseEnter={variant === 'desktop' && shouldRotate ? () => setIsPaused(true) : undefined}
      onMouseLeave={variant === 'desktop' && shouldRotate ? () => setIsPaused(false) : undefined}
      style={{
        marginTop: variant === 'mobile' ? '10px' : undefined,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: horizontalAlignment
      }}
    >
      <div
        data-testid="musician-countdown-stage"
        style={{
          position: 'relative',
          display: 'inline-flex',
          justifyContent: horizontalAlignment,
          minHeight: stageSize.height > 0 ? `${stageSize.height}px` : undefined,
          minWidth: stageSize.width > 0 ? `${stageSize.width}px` : undefined
        }}
      >
        <CountdownSurface
          item={activeItem}
          countdown={activeCountdown}
          isDark={isDark}
          variant={variant}
          layerRef={activeLayerRef}
        />

        {exitingItem && exitingCountdown && (
          <CountdownSurface
            item={exitingItem}
            countdown={exitingCountdown}
            isDark={isDark}
            variant={variant}
            layerRef={exitingLayerRef}
            isOverlay={true}
          />
        )}
      </div>

      {shouldRotate && (
        <div aria-hidden="true" style={measurementWrapperStyle}>
          {items.map((item) => (
            <CountdownSurface
              key={`measure-${item.id}`}
              item={item}
              countdown={countdownsById[item.id]}
              isDark={isDark}
              variant={variant}
              layerRef={setMeasurementRef(item.id)}
              measurementId={item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicianCountdown;
