// src/components/CalendarioAgendamentos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; // Certifique-se de importar moment
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment); // Usando moment diretamente

const CalendarioAgendamentos = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/meus-agendamentos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedEvents = response.data.map(agendamento => {
          // Verifique se a data e o horário estão disponíveis
          const eventStart = new Date(`${agendamento.data}T${agendamento.horario}`);
          const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // Supondo que a consulta dure 1 hora

          if (isNaN(eventStart.getTime())) {
            console.error(`Data inválida para agendamento: ${agendamento.data} ${agendamento.horario}`);
            return null; // Ignora eventos inválidos
          }

          return {
            id: agendamento.id,
            title: agendamento.medico.nome,
            start: eventStart,
            end: eventEnd,
            allDay: false,
          };
        }).filter(event => event !== null); // Filtra eventos inválidos

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    fetchAgendamentos();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Meus Agendamentos no Calendário</h2>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month', 'week', 'day']}
          selectable
          onSelectEvent={event => alert(`Consulta com: ${event.title}`)}
          onSelectSlot={slotInfo => alert(`Você selecionou: ${slotInfo.start}`)}
        />
      </div>
    </div>
  );
};

export default CalendarioAgendamentos;
