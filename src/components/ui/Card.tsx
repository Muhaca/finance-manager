import type { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';

type CardProps = PressableProps & {
    children: ReactNode;
};


export default function Card({
    children,
    className,
    ...props
}: CardProps) {
    return (
        <Pressable
            className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 ${className ?? ''}`}
            {...props}
        >
            {children}
        </Pressable>
    );
}

