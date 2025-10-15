import Image from 'next/image';
import { cases, userProfile } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from '@/components/icons/star-icon';
import { CaseOpeningModal } from '@/components/case-opening-modal';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Choose Your Case</h1>
        <p className="text-muted-foreground mt-2">The higher the cost, the greater the reward.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cases.map((caseItem) => (
          <Card key={caseItem.id} className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
            <CardContent className="p-0 text-center relative flex flex-col items-center justify-between h-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold font-headline text-foreground">{caseItem.name}</h2>
              </div>
              <div className="relative w-full aspect-[4/5] max-w-xs mx-auto">
                 <Image
                    src={caseItem.image.imageUrl}
                    alt={caseItem.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    data-ai-hint={caseItem.image.imageHint}
                  />
              </div>
              <div className="w-full p-6 mt-auto">
                 <CaseOpeningModal caseItem={caseItem} userStars={userProfile.stars}>
                   <div className="w-full bg-primary text-primary-foreground h-14 rounded-lg flex items-center justify-center gap-2 text-lg font-bold cursor-pointer transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <span>Open for</span>
                      <StarIcon className="w-5 h-5 fill-current" />
                      <span>{caseItem.cost}</span>
                   </div>
                 </CaseOpeningModal>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
