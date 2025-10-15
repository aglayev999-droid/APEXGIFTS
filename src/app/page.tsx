

import Image from 'next/image';
import { cases } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { CaseOpeningModal } from '@/components/case-opening-modal';
import { FreeCaseTimer } from '@/components/free-case-timer';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* This heading is now hidden, per the design */}
      <div className="text-center mb-8 hidden">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Choose Your Case</h1>
        <p className="text-muted-foreground mt-2">The higher the cost, the greater the reward.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cases.map((caseItem) => (
          <Card key={caseItem.id} className="bg-card border-border overflow-hidden group rounded-xl">
            <CardContent className="p-3 text-center relative flex flex-col items-center justify-between h-full">
              <div className="relative w-full aspect-square max-w-xs mx-auto">
                 <Image
                    src={caseItem.image.imageUrl}
                    alt={caseItem.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    data-ai-hint={caseItem.image.imageHint}
                  />
              </div>
              <div className="w-full mt-3">
                <h2 className="text-md font-semibold text-foreground truncate">{caseItem.name}</h2>
                {caseItem.cost > 0 ? (
                  <CaseOpeningModal caseItem={caseItem}>
                    <div className="w-full bg-primary text-primary-foreground h-10 rounded-lg flex items-center justify-center gap-2 text-md font-bold cursor-pointer transition-all duration-300 group-hover:bg-primary/90 mt-2">
                       <span>{caseItem.cost}</span>
                       <Image src="https://i.ibb.co/RkKvqDcd/stars.png" alt="Stars" width={20} height={20} />
                    </div>
                  </CaseOpeningModal>
                ) : (
                  <FreeCaseTimer />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
