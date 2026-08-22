import {
  FONT, GOAL_FILL, GOAL_FILL_ACTIVE, TASK_FILL, TASK_FILL_ACTIVE,
  STROKE_IDLE, STROKE_ACTIVE, OVERDUE, OVERDUE_STROKE,
  initials, isOverdue, nodeMeta,
  type GoalNode, type TaskNode,
} from './data';
import type { Point } from './geometry';

/** Overlapping initial-avatars, capped at three. */
export function AvatarStack({ names }: { names: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {names.slice(0, 3).map((n, i) => (
        <div
          key={i}
          style={{
            width: 16, height: 16, borderRadius: '50%',
            background: '#FAFAFA', color: '#18181B',
            fontSize: 7, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #2C2C2B',
            marginLeft: i === 0 ? 0 : -5,
            flexShrink: 0,
          }}
        >
          {initials(n)}
        </div>
      ))}
    </div>
  );
}

/**
 * A goal or task box. The body is a foreignObject so the label can use real
 * text layout (line clamping, ellipsis) instead of SVG text measurement, and it
 * is pointer-events:none so clicks always land on the <rect> underneath.
 */
export function GraphNodeBox({
  node, pos, isGoal, active, selected = false,
}: {
  node: GoalNode | TaskNode;
  pos: Point;
  isGoal: boolean;
  active: boolean;
  selected?: boolean;
}) {
  const goal = isGoal ? (node as GoalNode) : null;
  const progress = goal?.progress;
  const pct = progress && progress.total > 0
    ? Math.round((progress.done / progress.total) * 100)
    : 0;

  return (
    <>
      <rect
        x={pos.x - node.w / 2}
        y={pos.y - node.h / 2}
        width={node.w}
        height={node.h}
        rx={isGoal ? 14 : 8}
        fill={isGoal ? (active ? GOAL_FILL_ACTIVE : GOAL_FILL) : active ? TASK_FILL_ACTIVE : TASK_FILL}
        stroke={selected ? STROKE_ACTIVE : isOverdue(node) ? OVERDUE_STROKE : active ? STROKE_ACTIVE : STROKE_IDLE}
        strokeWidth={selected || active ? 1.5 : 1}
      />
      <foreignObject
        x={pos.x - node.w / 2 + 14}
        y={pos.y - node.h / 2}
        width={node.w - 28}
        height={node.h}
        style={{ pointerEvents: 'none', overflow: 'hidden' }}
      >
        <div
          style={{
            padding: isGoal ? '11px 0' : '8px 0',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: isGoal ? 5 : 3, height: '100%', boxSizing: 'border-box',
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '0.07em', textTransform: 'uppercase',
            }}
          >
            <span style={{ color: isGoal ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>
              {isGoal ? 'Goal' : 'Task'}
            </span>
            {nodeMeta(node).map((m, i) => (
              <span key={i}>
                <span style={{ color: 'rgba(255,255,255,0.18)' }}>{' · '}</span>
                <span style={{ color: m.color }}>{m.text}</span>
              </span>
            ))}
          </span>

          <p
            style={{
              margin: 0,
              fontSize: isGoal ? 13 : 11,
              fontWeight: isGoal ? 600 : 500,
              color: isGoal
                ? active ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.88)'
                : active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.68)',
              lineHeight: 1.35,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: isGoal ? 3 : 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {node.title}
          </p>

          {goal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <AvatarStack names={goal.people} />
              {progress && progress.total > 0 && (
                <>
                  <div
                    style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: 'rgba(255,255,255,0.1)',
                      overflow: 'hidden', minWidth: 16,
                    }}
                  >
                    <div style={{ width: `${pct}%`, height: '100%', background: 'rgba(255,255,255,0.55)' }} />
                  </div>
                  <span
                    style={{
                      fontSize: 9, fontWeight: 600,
                      color: 'rgba(255,255,255,0.45)',
                      whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {progress.done}/{progress.total}
                  </span>
                  {progress.late > 0 && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: OVERDUE, whiteSpace: 'nowrap' }}>
                      {progress.late} late
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </foreignObject>
    </>
  );
}
