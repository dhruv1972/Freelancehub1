interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-gray-400 text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  )
}
