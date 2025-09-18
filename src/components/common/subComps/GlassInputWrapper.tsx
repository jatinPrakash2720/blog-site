export const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl bg-white/55 dark:bg-black/30 border-none hover:shadow-2xl shadow-2xs transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/50">
    {children}
  </div>
);
