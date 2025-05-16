import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

type CurriculumItem = {
    title: string;
    content: string;
};

interface CurriculumPreviewProps {
    curriculum: CurriculumItem[];
}

const CurriculumPreview: React.FC<CurriculumPreviewProps> = ({ curriculum }) => {
    if (!curriculum || curriculum.length === 0) {
        return null;
    }

    return (
        <Card className="border-ghibli-meadow/20">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-ghibli-forest korean-text">
                    <List className="h-5 w-5" />
                    AI 자동 생성 커리큘럼
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {curriculum.map((item, index) => (
                        <li key={index} className="flex flex-col">
                            <div className="flex items-start gap-2">
                                <span className="text-ghibli-forest font-semibold">{index + 1}.</span>
                                <span className="text-ghibli-midnight korean-text font-medium">{item.title}</span>
                            </div>
                            {item.content && (
                                <p className="ml-6 text-ghibli-stone text-sm korean-text">{item.content}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default CurriculumPreview;
