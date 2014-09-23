package com.gestionTemps 
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	/**
	 * <b>classe Minuteur </b>
	 * <p>
	 * cette classe permet de créer un minuteur
	 * </p>
	 * <b>par default</b>
	 * <ul>
	 * <li>1 seconde,</li>
	 * <li>1 sonnerie</li>
	 * <li>autostart est true</li>
	 * </ul>
	 * il convient de lancer initialise en premier <br/>
	 * puis si autostart est faux demarre
	 * @author samueld.fr
	 */
	public class Minuteur extends Sprite
	{
		/**
		 *@private
		 * Memorisation de la propriete debug
		 */
		private var _debug:Boolean = false;
		private var _id:uint;
		private var _nbSonneries:int = 1;
		private var _temps:Number = 1000;
		private var _autoStart:Boolean = true;
		private var _myTimer:Timer;
		
		public static const MINUTEUR_DEMARRE:String = "demarre";
		public static const MINUTEUR_SONNE:String = "sonne";
		public static const MINUTEUR_ARRETE:String = "arrete";
		
		private var _eventDemarre:Event = new Event(MINUTEUR_DEMARRE);
		private var _eventSonne:Event = new Event(MINUTEUR_SONNE);
		private var _eventArret:Event = new Event(MINUTEUR_ARRETE);
		
		public function Minuteur() 
		{
			if (_debug) {				
				trace(this);
			}
		}
		
		/**
		 * indispensable
		 */
		public function initialise():void {
			if(_myTimer){
				
				_myTimer.removeEventListener(TimerEvent.TIMER, sonne);
				_myTimer.removeEventListener(TimerEvent.TIMER_COMPLETE, arreteMinuteur);
				_myTimer=null;
			}
			
			
			_myTimer = new Timer(_temps, _nbSonneries);
			_myTimer.addEventListener(TimerEvent.TIMER, sonne);
			_myTimer.addEventListener(TimerEvent.TIMER_COMPLETE, arreteMinuteur);
			if (_autoStart == true) {
				
				demarre();
				
			}
			
		}
		
		
		
		public function pause():void{
			_myTimer.stop();
			
		}
		
		public function finPause():void{
			_myTimer.start();
			
		}
		
		
		private function arreteMinuteur(e:TimerEvent):void 
		{
			if (_debug) {
				trace(this, ' OFF');
			}
			
			
			dispatchEvent(_eventArret);
		}
		
		private function sonne(e:TimerEvent):void 
		{
			if (_debug) {
				trace(this, ' driiiiiiinng');
			}
			dispatchEvent(_eventSonne);
		}
		
		public function demarre():void {
			_myTimer.start();
			dispatchEvent(_eventDemarre);
			if (_debug) {
				trace(this, ' demarre');
			}
		}
		
		
		
		//==================================================
		//==================================================
		//==================================================
		//==================================================
		
		
		
	
		public function get nbSonneries():int{	
			
			return _nbSonneries;
		}
		
		public function set nbSonneries(value:int):void 
		{
			_nbSonneries = value;
		}
		
		public function get temps():Number 
		{
			return _temps;
		}
		
		public function set temps(value:Number):void 
		{
			_temps = value;
		}
		
		public function get autoStart(): Boolean
		{
			return _autoStart;
		}
		
		public function set autoStart(value:Boolean):void 
		{
			_autoStart = value;
		}
		/**
		 * exemple de doc de var privee c'est une booleenne
		 *@default"false"
		 */
		public function get debug():Boolean 
		{
			return _debug;
		}
		
		public function set debug(value:Boolean):void 
		{
			_debug = value;
		}

		public function get id():uint
		{
			return _id;
		}

		public function set id(value:uint):void
		{
			_id = value;
		}

	}

}