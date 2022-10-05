import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <div className="flex h-screen">
      <Head>
        <title>Play | Pog Flip</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen p-10">
        <div className="flex flex-col w-full sm:flex-row">
          <div className="flex-grow border-2 text-center text-2xl p-8">
            <div>Pogman</div>
            <div className="mt-8">
              <Image
                src="https://arweave.net/RwDeriud_rdVMyaNRA1IPeBbfLQFM0skY0Y32nXuCRM?ext=png"
                width="256"
                height="256"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col h-full">
              <div className="flex-grow">&nbsp;</div>
              <div>
                <button className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full m-10">
                  FLIP
                </button>
              </div>
              <div className="flex-grow">&nbsp;</div>
            </div>
          </div>
          <div className="flex-grow border-2 text-center text-2xl p-8">
            <div>Player</div>

            <div className="mt-8">
              <Image
                src="https://arweave.net/KPtfLSz8u5cwvkUt9bYGSuErJFYuZz84cWfZYZ0Nfu4?ext=png"
                width="256"
                height="256"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
