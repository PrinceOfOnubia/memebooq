const now = Date.now();
const inDays = (d: number) => new Date(now + d * 86_400_000).toISOString();
const agoH = (h: number) => new Date(now - h * 3_600_000).toISOString();

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const av = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${seed}&backgroundType=gradientLinear`;

export const creators = {
  bnbchain: { id: "c1", type: "project", name: "BNB Chain", handle: "BNBCHAIN", avatar: av("bnbchain"), verified: true },
  pancake: { id: "c2", type: "project", name: "PancakeSwap", handle: "PancakeSwap", avatar: av("pancake"), verified: true },
  pixelpepe: { id: "c3", type: "project", name: "Pixel Pepe", handle: "pixelpepe", avatar: av("pixelpepe"), verified: true },
  degenlab: { id: "c4", type: "project", name: "Degen Lab", handle: "degenlab", avatar: av("degenlab"), verified: true },
  satoshigirl: { id: "u1", type: "user", name: "satoshi.girl", handle: "satoshigirl", avatar: av("satoshigirl"), verified: false },
};

export const challenges = [
  {
    id: "ch1",
    slug: "bnb-chain-shill-mania",
    title: "BNB Chain Meme Mania",
    cover: img("photo-1620207418302-439b387441b0"),
    category: "Memes",
    rewardPool: 25000,
    rewardToken: "BNB",
    rewardAmount: 42,
    winners: 25,
    creator: creators.bnbchain,
    participants: 3842,
    startsAt: agoH(72),
    endsAt: inDays(4),
  },
  {
    id: "ch2",
    slug: "why-defi-thread-contest",
    title: "Why DeFi? - Best Explainer Thread",
    cover: img("photo-1639762681485-074b7f938ba0"),
    category: "Threads",
    rewardPool: 12000,
    rewardToken: "USDT",
    rewardAmount: 12000,
    winners: 10,
    creator: creators.pancake,
    participants: 1206,
    startsAt: agoH(40),
    endsAt: inDays(2),
  },
  {
    id: "ch3",
    slug: "pixel-pepe-pfp-jam",
    title: "Pixel Pepe PFP Design Jam",
    cover: img("photo-1634986666676-ec8fd927c23d"),
    category: "Design",
    rewardPool: 8000,
    rewardToken: "MEME",
    rewardAmount: 4_000_000,
    winners: 15,
    creator: creators.pixelpepe,
    participants: 894,
    startsAt: agoH(120),
    endsAt: inDays(6),
  },
  {
    id: "ch4",
    slug: "ai-trading-bot-demo",
    title: "Show Your AI Trading Agent",
    cover: img("photo-1677442136019-21780ecad995"),
    category: "AI",
    rewardPool: 15000,
    rewardToken: "USDT",
    rewardAmount: 15000,
    winners: 8,
    creator: creators.degenlab,
    participants: 567,
    startsAt: agoH(20),
    endsAt: inDays(9),
  },
];

export const getChallenge = (slug: string) => challenges.find((challenge) => challenge.slug === slug);

export const submissions = [
  { id: "s1", challengeId: "ch1", challengeTitle: "BNB Chain Meme Mania", cover: challenges[0].cover, user: creators.satoshigirl, link: "https://x.com/satoshigirl/status/1", type: "X Post", status: "Winner", submittedAt: agoH(50), reward: 1.6 },
  { id: "s2", challengeId: "ch2", challengeTitle: "Why DeFi? - Best Explainer Thread", cover: challenges[1].cover, user: creators.satoshigirl, link: "https://x.com/satoshigirl/status/2", type: "X Thread", status: "Approved", submittedAt: agoH(8) },
];

export const notifications = [
  {
    id: "n1",
    kind: "win",
    title: "You won a challenge! 🏆",
    body: "Your entry placed in the Top 25 of BNB Chain Meme Mania. 1.6 BNB is on its way to your wallet.",
    at: agoH(0.4),
    unread: true,
    href: "/challenge/bnb-chain-shill-mania",
    actor: creators.bnbchain,
  },
];

export const projects = [
  {
    id: "c1",
    name: "BNB Chain",
    handle: "BNBCHAIN",
    avatar: av("bnbchain"),
    banner: img("photo-1639322537228-f710d846310a", 1400),
    verified: true,
    description:
      "The community-driven blockchain ecosystem powering the next generation of Web3.",
    website: "bnbchain.org",
    contract: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    totalSponsored: 312000,
    activeChallenges: 3,
    completedChallenges: 41,
  },
  {
    id: "c2",
    name: "PancakeSwap",
    handle: "PancakeSwap",
    avatar: av("pancake"),
    banner: img("photo-1518544866330-4e716499f800", 1400),
    verified: true,
    description: "The #1 DEX on BNB Chain.",
    website: "pancakeswap.finance",
    contract: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    totalSponsored: 184500,
    activeChallenges: 2,
    completedChallenges: 27,
  },
];

export const getProject = (handle: string) =>
  projects.find((project) => project.handle.toLowerCase() === handle.toLowerCase());

export const me = {
  id: "u1",
  name: "satoshi.girl",
  handle: "satoshigirl",
  avatar: av("satoshigirl"),
  banner: img("photo-1614851099511-773084f6911d", 1400),
  wallet: "0x7a25f1c9aB4e7d2F9c5B3e8a1D4f6C2b9E0a3D7c",
  bio: "Meme alchemist • DeFi degen • turning timelines into treasure.",
  xConnected: true,
  joined: 38,
  created: 4,
  wins: 12,
  earned: 18450,
};

export const leaderboard = {
  winners: [
    { id: "w1", rank: 1, name: "satoshi.girl", handle: "satoshigirl", avatar: av("w1"), verified: true, value: 40500, wins: 28, delta: 1 },
    { id: "w2", rank: 2, name: "Memelord", handle: "shilllord_eth", avatar: av("w2"), verified: false, value: 27500, wins: 24, delta: 0 },
    { id: "w3", rank: 3, name: "zk.pilled", handle: "zkpilled", avatar: av("w3"), verified: false, value: 21400, wins: 20, delta: -1 },
  ],
  contributors: [
    { id: "c1", rank: 1, name: "satoshi.girl", handle: "satoshigirl", avatar: av("c1"), verified: true, value: 410, wins: 19, delta: 1 },
    { id: "c2", rank: 2, name: "Memelord", handle: "shilllord_eth", avatar: av("c2"), verified: false, value: 382, wins: 18, delta: 0 },
  ],
  projects: [
    { id: "p1", rank: 1, name: "BNB Chain", handle: "BNBCHAIN", avatar: av("p1"), verified: true, value: 312000, wins: 41, delta: 1 },
    { id: "p2", rank: 2, name: "PancakeSwap", handle: "PancakeSwap", avatar: av("p2"), verified: true, value: 184500, wins: 27, delta: 0 },
  ],
};

export const platformStats = {
  totalRewards: 1_840_000,
  activeChallenges: challenges.length,
  creators: 24_300,
  submissions: 186_400,
};
