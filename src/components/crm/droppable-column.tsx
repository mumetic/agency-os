'use client';

import { useDroppable } from '@dnd-kit/core';

interface Props {
  id: string;
  children: React.ReactNode;
}

export default function DroppableColumn({ id, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${isOver ? 'ring-2 ring-primary rounded-lg' : ''}`}
    >
      {children}
    </div>
  );
}