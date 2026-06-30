import { useMemo, useState } from 'react';
import styles from './App.module.css';

type Player = {
  id: string;
  name: string;
  role: string;
  club: string;
  imageUrl: string;
};

type Card = Player & {
  cardId: string;
  isMatched: boolean;
};

const players: Player[] = [
  {
    id: 'neymar',
    name: 'Neymar',
    role: 'Forward',
    club: 'Santos',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg/330px-Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg',
  },
  {
    id: 'vinicius',
    name: 'Vinicius Junior',
    role: 'Forward',
    club: 'Real Madrid',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg/330px-Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg',
  },
  {
    id: 'raphinha',
    name: 'Raphinha',
    role: 'Forward',
    club: 'Barcelona',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Raphinha_Brazil_V_Morocco_13_June_2026-133_%28cropped%29.jpg/330px-Raphinha_Brazil_V_Morocco_13_June_2026-133_%28cropped%29.jpg',
  },
  {
    id: 'endrick',
    name: 'Endrick',
    role: 'Forward',
    club: 'Lyon',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Team_Brazil_at_2026_FIFA_World_Cup_by_YantsImages_%28Endrick%29.jpg/330px-Team_Brazil_at_2026_FIFA_World_Cup_by_YantsImages_%28Endrick%29.jpg',
  },
  {
    id: 'martinelli',
    name: 'Gabriel Martinelli',
    role: 'Forward',
    club: 'Arsenal',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Gabriel_Martinelli_Brazil_V_Morocco_13_June_2026-144.jpg/330px-Gabriel_Martinelli_Brazil_V_Morocco_13_June_2026-144.jpg',
  },
  {
    id: 'casemiro',
    name: 'Casemiro',
    role: 'Midfielder',
    club: 'Manchester United',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Casemiro_Brazil_V_Morocco_13_June_2026-76_%28cropped%29.jpg/330px-Casemiro_Brazil_V_Morocco_13_June_2026-76_%28cropped%29.jpg',
  },
  {
    id: 'alisson',
    name: 'Alisson Becker',
    role: 'Goalkeeper',
    club: 'Liverpool',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Alisson_Becker_Brazil_V_Morocco_13_June_2026-117_%28cropped%29.jpg/330px-Alisson_Becker_Brazil_V_Morocco_13_June_2026-117_%28cropped%29.jpg',
  },
  {
    id: 'marquinhos',
    name: 'Marquinhos',
    role: 'Defender',
    club: 'Paris Saint-Germain',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Marquinhos_Brazil_V_Morocco_13_June_2026-153_%28cropped%29.jpg/330px-Marquinhos_Brazil_V_Morocco_13_June_2026-153_%28cropped%29.jpg',
  },
];

function shuffleCards(): Card[] {
  const pairedCards = players.flatMap((player) => [
    { ...player, cardId: `${player.id}-a`, isMatched: false },
    { ...player, cardId: `${player.id}-b`, isMatched: false },
  ]);

  return pairedCards
    .map((card) => ({ card, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ card }) => card);
}

export default function App() {
  const [cards, setCards] = useState<Card[]>(() => shuffleCards());
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isCheckingPair, setIsCheckingPair] = useState(false);

  const selectedCardIds = useMemo(() => new Set(selectedCards), [selectedCards]);
  const isComplete = matches === players.length;

  function startNewGame() {
    setCards(shuffleCards());
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setIsCheckingPair(false);
  }

  function selectCard(card: Card) {
    if (card.isMatched || isCheckingPair || selectedCardIds.has(card.cardId)) {
      return;
    }

    const nextSelectedCards = [...selectedCards, card.cardId];
    setSelectedCards(nextSelectedCards);

    if (nextSelectedCards.length !== 2) {
      return;
    }

    const [firstCardId, secondCardId] = nextSelectedCards;
    const firstCard = cards.find(({ cardId }) => cardId === firstCardId);
    const secondCard = cards.find(({ cardId }) => cardId === secondCardId);

    if (!firstCard || !secondCard) {
      setSelectedCards([]);
      return;
    }

    setMoves((currentMoves) => currentMoves + 1);
    setIsCheckingPair(true);

    if (firstCard.id === secondCard.id) {
      window.setTimeout(() => {
        setCards((currentCards) =>
          currentCards.map((currentCard) =>
            currentCard.id === firstCard.id ? { ...currentCard, isMatched: true } : currentCard,
          ),
        );
        setMatches((currentMatches) => currentMatches + 1);
        setSelectedCards([]);
        setIsCheckingPair(false);
      }, 450);
      return;
    }

    window.setTimeout(() => {
      setSelectedCards([]);
      setIsCheckingPair(false);
    }, 900);
  }

  return (
    <div className={styles.app}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Brazil 2026 World Cup</p>
          <h1>Selecao Memory Match</h1>
          <p className={styles.subtitle}>
            Flip the cards, remember the stars, and match every Brazilian player before the final whistle.
          </p>
        </div>
        <button className={styles.resetButton} type="button" onClick={startNewGame}>
          New game
        </button>
      </header>

      <main className={styles.gameShell}>
        <section className={styles.scoreboard} aria-label="Game status">
          <div>
            <span>{moves}</span>
            Moves
          </div>
          <div>
            <span>{matches}</span>
            Matches
          </div>
          <div>
            <span>{players.length - matches}</span>
            Left
          </div>
        </section>

        {isComplete ? (
          <section className={styles.winBanner} aria-live="polite">
            <strong>Champion memory!</strong>
            <span>You matched the whole Brazil squad board in {moves} moves.</span>
          </section>
        ) : null}

        <section className={styles.board} aria-label="Brazil player memory cards">
          {cards.map((card) => {
            const isFaceUp = card.isMatched || selectedCardIds.has(card.cardId);

            return (
              <button
                aria-label={isFaceUp ? `${card.name}, ${card.role}` : 'Hidden Brazilian player card'}
                className={`${styles.card} ${isFaceUp ? styles.faceUp : ''} ${
                  card.isMatched ? styles.matched : ''
                }`}
                disabled={card.isMatched || isCheckingPair}
                key={card.cardId}
                onClick={() => selectCard(card)}
                type="button"
              >
                <span className={styles.cardInner}>
                  <span className={styles.cardBack} aria-hidden="true">
                    <span className={styles.badge}>CBF</span>
                    <span>2026</span>
                  </span>
                  <span className={styles.cardFront}>
                    <img src={card.imageUrl} alt="" loading="lazy" />
                    <span className={styles.playerInfo}>
                      <strong>{card.name}</strong>
                      <span>
                        {card.role} - {card.club}
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
}
