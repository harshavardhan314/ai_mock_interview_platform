function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121611] p-6">
      <p className="text-sm font-medium text-white/50">{label}</p>
      <h3 className="mt-2 text-4xl font-black tracking-tight">{value}</h3>
      {helper ? <p className="mt-2 text-sm text-white/45">{helper}</p> : null}
    </div>
  );
}

export default MetricCard;

