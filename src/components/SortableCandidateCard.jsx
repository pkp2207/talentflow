import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CandidateCard from './CandidateCard.jsx';

const SortableCandidateCard = ({ candidate, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CandidateCard 
        candidate={candidate} 
        onClick={onClick}
        style={{
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing'
          }
        }}
      />
    </div>
  );
};

export default SortableCandidateCard;