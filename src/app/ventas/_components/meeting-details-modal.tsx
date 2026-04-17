'use client';

import { X } from 'lucide-react';
import { Badge } from '@/ui';
import {
  AWARENESS_CHANNEL_LABELS,
  INDUSTRY_LABELS,
  INTEGRATION_LEVEL_LABELS,
  SEASONALITY_LABELS,
  URGENCY_LABELS,
  USE_CASE_LABELS,
  WEEKLY_VOLUME_LABELS,
} from '@/lib/enum-labels';
import styles from './styles/meeting-details-modal.module.css';

export interface MeetingCategoryData {
  weeklyVolume: keyof typeof WEEKLY_VOLUME_LABELS;
  useCase: keyof typeof USE_CASE_LABELS;
  industry: keyof typeof INDUSTRY_LABELS;
  awarenessChannel: keyof typeof AWARENESS_CHANNEL_LABELS;
  seasonality: keyof typeof SEASONALITY_LABELS;
  urgency: keyof typeof URGENCY_LABELS;
  integrationLevel: keyof typeof INTEGRATION_LEVEL_LABELS;
}

export interface MeetingDetailsModalMeeting {
  date: Date;
  closed: boolean;
  transcription: string;
  client: { name: string };
  salesman: { name: string };
  meetingCategory: MeetingCategoryData | null;
}

interface MeetingDetailsModalProps {
  meeting: MeetingDetailsModalMeeting;
  onClose: () => void;
}

export function MeetingDetailsModal({ meeting, onClose }: MeetingDetailsModalProps) {
  const category = meeting.meetingCategory;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {meeting.client.name} - {meeting.salesman.name} /{' '}
            {new Date(meeting.date).toLocaleDateString('es-CL')}
          </h3>
          <div className={styles.modalHeaderRight}>
            {!category && (
              <Badge variant="neutral">Pendiente de clasificar</Badge>
            )}
            <Badge variant={meeting.closed ? 'success' : 'warning'}>
              {meeting.closed ? 'Cerrada' : 'Abierta'}
            </Badge>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div
          className={`${styles.modalBody} ${category ? styles.modalBodyWithCategories : ''}`}
        >
          <section className={styles.transcriptionSection}>
            <h4 className={styles.sectionTitle}>Transcripción</h4>
            <p className={styles.transcriptionText}>{meeting.transcription}</p>
          </section>

          {category && (
            <section className={styles.categoriesSection}>
              <h4 className={styles.sectionTitle}>Categorías</h4>
              <dl className={styles.categoryDetailList}>
                <div className={styles.categoryDetailItem}>
                  <dt>Volumen semanal</dt>
                  <dd>{WEEKLY_VOLUME_LABELS[category.weeklyVolume]}</dd>
                </div>
                <div className={styles.categoryDetailItem}>
                  <dt>Caso de uso</dt>
                  <dd>{USE_CASE_LABELS[category.useCase]}</dd>
                </div>
                <div className={styles.categoryDetailItem}>
                  <dt>Industria</dt>
                  <dd>{INDUSTRY_LABELS[category.industry]}</dd>
                </div>
                <div className={styles.categoryDetailItem}>
                  <dt>Canal</dt>
                  <dd>{AWARENESS_CHANNEL_LABELS[category.awarenessChannel]}</dd>
                </div>
                <div className={styles.categoryDetailItem}>
                  <dt>Estacionalidad</dt>
                  <dd>{SEASONALITY_LABELS[category.seasonality]}</dd>
                </div>
                <div className={styles.categoryDetailItem}>
                  <dt>Nivel de integración</dt>
                  <dd>{INTEGRATION_LEVEL_LABELS[category.integrationLevel]}</dd>
                </div>
                <div className={styles.categoryDetailItem}>
                  <dt>Urgencia</dt>
                  <dd>{URGENCY_LABELS[category.urgency]}</dd>
                </div>
              </dl>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
