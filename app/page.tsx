/* eslint-disable react/react-in-jsx-scope */
import { buttonVariants } from '@/components/ui/button';
import WordsLoop from '@/components/WordsLoop';
import Link from 'next/link';

const WordsArray = ['Confident', 'Proud', 'and', 'Secure'];

export default function Home() {
  return (
    <div className="mt-[56.8px] flex h-[calc(100vh-56.8px)] w-full flex-row items-center justify-center gap-y-7 md:justify-between">
      <div className="w-[80%] md:ml-24 lg:scale-110">
        <h1 className="text-7xl font-bold">
          Defining Messages <br></br> that are{' '}
          <span className="block lg:inline">
            <WordsLoop words={WordsArray} speed={300} display="inline" />
          </span>
        </h1>
        <div className="mx-auto mt-5">
          <Link
            href={'/chat'}
            className={buttonVariants({
              variant: 'secondary',
              className:
                'text-lg font-bold transition-all hover:bg-slate-500 hover:text-slate-100',
            })}
          >
            chat now
          </Link>
          <Link
            href={'/about'}
            className={buttonVariants({
              variant: 'link',
            })}
          >
            How it works?
          </Link>
        </div>
      </div>
      <div className="relative mr-24 hidden h-2/3 w-1/2 md:block lg:w-[400px]">
        <div className="up absolute bottom-0 left-0 z-10 h-2/3 w-2/3 border border-black bg-blue-300 p-1"></div>
        <div className="down absolute right-0 top-0 h-2/3 w-2/3 border border-black bg-slate-600 p-1" />
      </div>
    </div>
  );
}
