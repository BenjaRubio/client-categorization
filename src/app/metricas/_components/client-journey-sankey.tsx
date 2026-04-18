import { useMemo } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import type { MetricsMeetingRow } from './metrics-dashboard';
import { INDUSTRY_LABELS, INTEGRATION_LEVEL_LABELS } from '@/lib/enum-labels';

interface ClientJourneySankeyProps {
  meetings: MetricsMeetingRow[];
}

const COLORS = ['#22d3ee', '#4ade80', '#818cf8', '#facc15', '#fb7185', '#a78bfa', '#34d399', '#f97316'];

const CustomNode = ({ x, y, width, height, index, payload, containerWidth }: any) => {
  const safeX = x || 0;
  const safeY = y || 0;
  const safeWidth = Math.max(0, width || 0);
  const safeHeight = Math.max(0, height || 0);
  
  const isOut = safeX + safeWidth + 10 > (containerWidth || 1000);
  
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={safeX}
        y={safeY}
        width={safeWidth}
        height={safeHeight}
        fill={payload.fill || "#6366f1"}
        fillOpacity={1}
        radius={[2, 2, 2, 2]}
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? safeX - 6 : safeX + safeWidth + 6}
        y={safeY + safeHeight / 2}
        fontSize="12"
        fill="#ffffff"
        dominantBaseline="middle"
      >
        {payload.name}
      </text>
    </Layer>
  );
};

export function ClientJourneySankey({ meetings }: ClientJourneySankeyProps) {
  const data = useMemo(() => {
    const nodeIndexMap = new Map<string, number>();
    const nodes: { name: string; fill: string }[] = [];
    const industryColors = new Map<string, string>();
    let colorIndex = 0;

    const getIndustryColor = (id: string) => {
      if (!industryColors.has(id)) {
        industryColors.set(id, COLORS[colorIndex % COLORS.length]);
        colorIndex++;
      }
      return industryColors.get(id)!;
    };

    const addNode = (id: string, name: string, color: string) => {
      if (!nodeIndexMap.has(id)) {
        nodeIndexMap.set(id, nodes.length);
        nodes.push({ name, fill: color });
      }
      return nodeIndexMap.get(id)!;
    };

    const linkValueMap = new Map<string, number>();

    const addLink = (source: number, target: number) => {
      const key = `${source}-${target}`;
      linkValueMap.set(key, (linkValueMap.get(key) || 0) + 1);
    };

    meetings.forEach((meeting) => {
      if (!meeting.meetingCategory) return;

      const industryName = INDUSTRY_LABELS[meeting.meetingCategory.industry] || 'Otra Industria';
      const integrationName =
        INTEGRATION_LEVEL_LABELS[meeting.meetingCategory.integrationLevel] || 'Otra Integración';
      const closedName = meeting.closed ? 'Venta Cerrada' : 'Venta No Cerrada';

      const industryColor = getIndustryColor(`ind-${meeting.meetingCategory.industry}`);

      // We assign specific colors to the intermediate and target nodes
      const sourceNode = addNode(`ind-${meeting.meetingCategory.industry}`, industryName, industryColor);
      const midNode = addNode(`int-${meeting.meetingCategory.integrationLevel}`, `Int. ${integrationName}`, '#94a3b8');
      const targetNode = addNode(`cls-${meeting.closed}`, closedName, meeting.closed ? '#4ade80' : '#f87171');

      addLink(sourceNode, midNode);
      addLink(midNode, targetNode);
    });

    const links = Array.from(linkValueMap.entries()).map(([key, value]) => {
      const [source, target] = key.split('-').map(Number);
      return { source, target, value };
    });

    return { nodes, links };
  }, [meetings]);

  if (data.nodes.length === 0 || data.links.length === 0) {
    return <p>No hay datos suficientes para este gráfico.</p>;
  }

  return (
    <div style={{ width: '100%', height: 600, minHeight: 600 }}>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<CustomNode />}
          nodePadding={10}
          margin={{
            left: 20,
            right: 120,
            top: 20,
            bottom: 20,
          }}
          link={{ stroke: '#6366f1', strokeOpacity: 0.2 }}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text)',
            }}
            itemStyle={{ color: 'var(--color-text)' }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
