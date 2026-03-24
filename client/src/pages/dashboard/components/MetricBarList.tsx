import { motion } from 'framer-motion';

interface MetricBarRow {
  name?: string;
  source?: string;
  percentage: number;
  amount?: string;
}

const MetricBarList = ({
  rows,
  valueKey,
}: {
  rows: MetricBarRow[];
  valueKey: 'percentage' | 'amount';
}) => (
  <ul className="flex flex-col gap-3.5">
    {rows.map((row, index) => {
      const label = row.name ?? row.source ?? '';

      return (
        <motion.li
          key={label}
          className="flex flex-col gap-1.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.07, duration: 0.35 }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-normal text-[color:var(--lens-ink)]">
              {label}
            </span>
            <span className="shrink-0 text-[11px] font-normal text-[color:var(--lens-ink)]/45">
              {valueKey === 'amount' ? row.amount : `${row.percentage}%`}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--lens-sand)]">
            <motion.div
              className="h-full rounded-full bg-[color:var(--lens-blue)]"
              initial={{ width: 0 }}
              animate={{ width: `${row.percentage}%` }}
              transition={{
                delay: 0.48 + index * 0.07,
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          </div>
        </motion.li>
      );
    })}
  </ul>
);

export default MetricBarList;
