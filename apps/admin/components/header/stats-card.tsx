// Props types
type StatsCardProps = {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bg: string;
};

export default function StatsCard({ title, value, icon: Icon, color, bg }: StatsCardProps) {

    // One stats card
    return (
        <article className="flex justify-between items-center p-6 bg-white rounded-xl border border-neutral-200">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-2xl font-semibold">{value}</h2>
            </div>

            <div className={`p-3 rounded-lg ${bg}`}>
                <Icon className={color} size={24} />
            </div>
        </article>
    );
};
