export interface Planet {
        spaceId: string;
        spaceName: string;
        letterCount: number;
        checked: boolean;
        current: boolean;
};

export const PLANETS = [
    {
        spaceId: "0",
        spaceName: "ASAP",
        letterCount: 5,
        checked: true,
        current: true,
    },
    {
        spaceId: "1",
        spaceName: "20학번 동기들",
        letterCount: 12,
        checked: false,
        current: false,
    },
    {
        spaceId: "2",
        spaceName: "기디 소모임",
        letterCount: 9,
        checked: false,
        current: false,
    },
    {
        spaceId: "3",
        spaceName: "백프 프렌즈",
        letterCount: 7,
        checked: false,
        current: false,
    },
    {
        spaceId: "4",
        spaceName: "고딩 동창들",
        letterCount: 3,
        checked: false,
        current: false,
    },
    {
        spaceId: "5",
        spaceName: "학회 모임",
        letterCount: 15,
        checked: false,
        current: false,
    },
]