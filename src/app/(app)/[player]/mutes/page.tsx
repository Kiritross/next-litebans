import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

import { language } from "@/lib/language/dictionaries";
import p from "@/lib/language/utils/parse";
import q from "@/lib/language/utils/quantity";
import { 
  getPlayerBanCount, 
  getPlayerByName, 
  getPlayerKickCount, 
  getPlayerMuteCount, 
  getPlayerWarnCount 
} from "@/lib/punishment/player";

import { getPage, getStaff } from "@/utils/searchParams";

import { Icons } from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { MutesTable } from "@/components/punishments/mutes/mutes-table";

export async function generateMetadata({ params }: { params: { player: string } }) {
  
  const { dictionary } = await language();
  
  return {
    title: p(dictionary.pages.playerHistory.title, {
      player: params.player.replace("%40", '')
    })
  }
}

export default async function Mutes({
  searchParams,
  params
}: {
  searchParams: { [key: string]: string | string[] | undefined },
  params: { player: string }
}) {
  const { dictionary } = await language();
  const localDictionary = dictionary.pages.playerHistory;
  
  const page = getPage({searchParams});

  const playerName = params.player.replace("%40", '');
  const player = await getPlayerByName(playerName);

  if (!player) {
    notFound();
  }

  const staff = getStaff({searchParams});

  const banCount = await getPlayerBanCount(player.uuid!);
  const muteCount = await getPlayerMuteCount(player.uuid!);
  const warnCount = await getPlayerWarnCount(player.uuid!);
  const kickCount = await getPlayerKickCount(player.uuid!);

  return (
    <div className="flex h-full flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-18">
      <div className="space-y-2 md:flex md:space-x-4">
        <Image 
          src={`https://skins.mcstats.com/bust/${player.uuid}`} 
          alt={playerName}
          width={192}
          height={192}
          className="mx-auto"
        />
        <div className="md:w-[350px] md:py-4 space-y-1">
          <h1 className="text-center md:text-left text-4xl font-bold leading-tight tracking-tighter sm:text-5xl lg:leading-[1.1]">
            {p(localDictionary.title, {
              player: params.player.replace("%40", '')
            })}
          </h1>
          <div className="flex space-x-2 whitespace-nowrap">
            {banCount > 0 && 
              <Link href={`/@${playerName}/bans`}>
                <Badge variant="secondary" className="px-1 text-secondary-foreground/50">
                  <Icons.ban className="w-4 h-4 mr-1" /> {banCount} {q(dictionary.words.bans, banCount).toUpperCase()}
                </Badge>
              </Link>
            }
            {muteCount > 0 && 
              <Link href={`/@${playerName}/mutes`}>
                <Badge className="px-1">
                  <Icons.mute className="w-4 h-[0.9rem] mr-1" /> {muteCount} {q(dictionary.words.mutes, muteCount).toUpperCase()}
                </Badge>
              </Link>
            }
            {warnCount > 0 && 
              <Link href={`/@${playerName}/warns`}>
                <Badge variant="secondary" className="px-1 text-secondary-foreground/50">
                  <Icons.warn className="w-4 h-4 mr-1" /> {warnCount} {q(dictionary.words.warns, warnCount).toUpperCase()}
                </Badge>
              </Link>
            }
            {kickCount > 0 && 
              <Link href={`/@${playerName}/kicks`}>
                <Badge variant="secondary" className="px-1 text-secondary-foreground/50">
                  <Icons.kick className="w-4 h-4 mr-1" /> {kickCount} {q(dictionary.words.kicks, kickCount).toUpperCase()}
                </Badge>
              </Link>
            }
          </div>
        </div>
      </div>

      <section className="w-full lg:w-[975px]">
        <MutesTable page={page} player={player.uuid!} staff={staff} />
      </section>
    </div>
  );
}