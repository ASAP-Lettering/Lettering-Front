// styles/DatePickerStyles.ts
import styled from "styled-components";
import { animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { theme } from "@/styles/theme";

interface ItemPickerProps {
  items: string[];
  defaultItem?: string;
  unit: string;
  onChange: (item: string) => void;
}

interface ItemProps {
  isSelected: boolean;
}

const NewItemPicker: React.FC<ItemPickerProps> = ({
  items,
  defaultItem,
  unit,
  onChange,
}) => {
  const initialItem = defaultItem || items[0];
  const [selectedItem, setSelectedItem] = useState<string>(initialItem);
  const refContainer = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const itemElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const index = items.indexOf(selectedItem);
    const currentElement = itemElementsRef.current[index];
    if (currentElement && refContainer.current) {
      const offsetTop = currentElement.offsetTop;
      const scrollPosition =
        offsetTop -
        refContainer.current.offsetHeight / 2 +
        currentElement.offsetHeight / 2;
      refContainer.current.scrollTop = scrollPosition;
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemStr = entry.target.getAttribute("data-item");
            if (itemStr) {
              setSelectedItem(itemStr);
              onChange(itemStr);
            }
          }
        });
      },
      {
        root: refContainer.current,
        rootMargin: `-60px 0px -60px 0px`,
        threshold: 0.8,
      }
    );

    const elements = itemElementsRef.current.filter(Boolean);
    elements.forEach((elem) => observer.current?.observe(elem!));

    return () => {
      elements.forEach((elem) => observer.current?.unobserve(elem!));
      observer.current?.disconnect();
    };
  }, [items]);

  return (
    <ItemPickerContainer ref={refContainer}>
      {items.map((item, index) => (
        <Item
          key={index}
          ref={(el) => {
            itemElementsRef.current[index] = el;
          }}
          data-item={item}
          isSelected={item === selectedItem}
          whileTap={{ scale: 0.95 }}
        >
          {item}
          {unit}
        </Item>
      ))}
    </ItemPickerContainer>
  );
};

export default NewItemPicker;

const ItemPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
  gap: 15px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  padding-top: 70px;
  padding-bottom: 70px;
  scrollbar-width: none;
  z-index: 10;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled(motion.div)<ItemProps>`
  flex: 0 0 auto;
  height: 60px;
  box-sizing: border-box;
  padding: 10px 0;
  line-height: 60px;
  text-align: center;
  justify-content: center;
  scroll-snap-align: center;
  ${(isSelected) =>
    isSelected ? theme.fonts.medium24 : theme.fonts.regular25};
  color: ${({ isSelected }) => (isSelected ? "white" : theme.colors.gray600)};
  transition: color 0.7s;
  cursor: pointer;
`;
