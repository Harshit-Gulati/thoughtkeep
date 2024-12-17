import { useRecoilValue } from "recoil";
import { Card } from "./Card";
import { contentsAtom } from "../../store/contentsAtom";

export const CardList = () => {
  const cardData: any = useRecoilValue(contentsAtom);
  return (
    <>
      {cardData.map((card: any) => (
        <div key={card._id} className="break-inside-avoid mb-4">
          <Card
            type={card.type}
            link={card.link}
            title={card.title}
            id={card._id}
          />
        </div>
      ))}
    </>
  );
};
